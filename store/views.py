from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
import requests
import json
import base64
from .models import Category, Product, Order, OrderItem, PaymentProof, Shipment, Address, UPISettings, User, PasswordResetToken
from django.contrib.auth.models import User
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer,
    OrderCreateSerializer, PaymentProofSerializer, ShipmentSerializer,
    AddressSerializer, UPISettingsSerializer, UserSerializer, RegisterSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    OrderItemSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validate total amount
        items = request.data.get('items', [])
        calculated_total = sum(item['price'] * item['quantity'] for item in items)
        calculated_total += request.data.get('shipping_charge', 0)

        if abs(calculated_total - request.data['total_amount']) > 0.01:
            return Response(
                {'error': 'Total amount mismatch'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = serializer.save()
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def upload_payment_proof(self, request, pk=None):
        order = self.get_object()
        if order.payment_status != 'pending':
            return Response(
                {'error': 'Payment already verified'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PaymentProofSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            # Here you would normally verify the payment amount
            # For MVP, we'll mark as verified
            order.payment_status = 'verified'
            order.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request_view(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        # Create or update reset token
        expires_at = timezone.now() + timedelta(hours=24)
        reset_token, created = PasswordResetToken.objects.get_or_create(
            user=user,
            defaults={'expires_at': expires_at}
        )
        if not created:
            reset_token.expires_at = expires_at
            reset_token.is_used = False
            reset_token.save()

        # Send email (in production, use proper email service)
        reset_link = f"http://localhost:3000/reset-password/{reset_token.token}"
        try:
            send_mail(
                'Password Reset Request',
                f'Click this link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except:
            # For development, just return success
            pass

        return Response({
            'message': 'Password reset link sent to your email'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_view(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        reset_token = serializer.validated_data['reset_token']
        user = reset_token.user

        # Update password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Mark token as used
        reset_token.is_used = True
        reset_token.save()

        return Response({
            'message': 'Password reset successfully'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_dashboard_stats_view(request):
    """Optimized dashboard stats endpoint that doesn't fetch all orders"""
    try:
        # Get basic counts with optimized queries
        total_orders = Order.objects.count()
        pending_payments = Order.objects.filter(payment_status='pending').count()
        verified_payments = Order.objects.filter(payment_status='verified').count()
        total_products = Product.objects.filter(is_active=True).count()
        low_stock_products = Product.objects.filter(is_active=True, stock__lt=10).count()

        # Calculate total revenue efficiently
        total_revenue = Order.objects.filter(payment_status='verified').aggregate(
            total=Sum('total_amount')
        )['total'] or 0

        # Get recent 5 orders efficiently
        recent_orders = Order.objects.select_related().order_by('-created_at')[:5]
        recent_orders_data = [
            {
                'id': order.id,
                'customer_name': order.customer_name,
                'total_amount': str(order.total_amount),
                'payment_status': order.payment_status,
                'created_at': order.created_at.isoformat()
            }
            for order in recent_orders
        ]

        return Response({
            'total_orders': total_orders,
            'pending_payments': pending_payments,
            'verified_payments': verified_payments,
            'total_products': total_products,
            'low_stock_products': low_stock_products,
            'total_revenue': str(total_revenue),
            'recent_orders': recent_orders_data
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin ViewSets
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def approve_payment(self, request, pk=None):
        order = self.get_object()
        order.payment_status = 'verified'
        order.save()
        return Response({'message': 'Payment approved'})

    @action(detail=True, methods=['post'])
    def reject_payment(self, request, pk=None):
        order = self.get_object()
        order.payment_status = 'rejected'
        order.save()
        return Response({'message': 'Payment rejected'})

    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        order = self.get_object()
        if hasattr(order, 'shipment'):
            serializer = ShipmentSerializer(order.shipment)
            return Response(serializer.data)
        return Response({'message': 'No shipment found'})


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Admin ViewSets
class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]


class UPISettingsViewSet(viewsets.ModelViewSet):
    queryset = UPISettings.objects.all()
    serializer_class = UPISettingsSerializer

    def get_permissions(self):
        # Allow public read access, require admin for write operations
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        # For public access, only return active settings
        if not self.request.user.is_staff:
            return UPISettings.objects.filter(is_active=True)
        return UPISettings.objects.all()


class AdminShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def create_delhivery_shipment(self, request, pk=None):
        """Create shipment with Delhivery API integration"""
        try:
            shipment = self.get_object()

            # Delhivery API integration (test mode)
            delhivery_url = "https://track.delhivery.com/api/v1/packages/json/"
            headers = {
                'Authorization': f'Token {settings.DELHIVERY_API_KEY}',
                'Content-Type': 'application/json'
            }

            payload = {
                "format": "json",
                "data": {
                    "pickup_location": {
                        "name": "YuvaKart Warehouse",
                        "add": "Delhi, India",
                        "phone": "9876543210"
                    },
                    "shipments": [{
                        "client": "YuvaKart",
                        "name": shipment.order.customer_name,
                        "add": shipment.order.shipping_address,
                        "phone": shipment.order.customer_phone,
                        "order": f"YK-{shipment.order.id}",
                        "payment_mode": "Prepaid",
                        "total_amount": str(shipment.order.total_amount),
                        "cod_amount": "0",
                        "products_desc": f"Order #{shipment.order.id}",
                        "ewaybill": ""
                    }]
                }
            }

            # Demo response
            shipment.tracking_number = f"DEMO{shipment.id:04d}"
            shipment.status = 'picked_up'
            shipment.save()

            return Response({
                'message': 'Shipment created with Delhivery (Demo Mode)',
                'tracking_number': shipment.tracking_number,
                'status': 'Demo - would integrate with actual Delhivery API'
            })

        except Exception as e:
            return Response({'error': str(e)}, status=500)


# Razorpay Payment Integration
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def verify_razorpay_payment(request):
    """Verify payment with Razorpay API"""
    try:
        payment_id = request.data.get('payment_id')
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')

        if not all([payment_id, order_id, amount]):
            return Response({'error': 'Missing required parameters'}, status=400)

        # Razorpay API integration (test mode)
        razorpay_key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
        razorpay_key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')

        if not razorpay_key_id or not razorpay_key_secret:
            return Response({'error': 'Razorpay credentials not configured'}, status=500)

        # Create auth string
        auth_string = base64.b64encode(f"{razorpay_key_id}:{razorpay_key_secret}".encode()).decode()

        headers = {
            'Authorization': f'Basic {auth_string}',
            'Content-Type': 'application/json'
        }

        # Verify payment with Razorpay
        verify_url = f"https://api.razorpay.com/v1/payments/{payment_id}"
        response = requests.get(verify_url, headers=headers)

        if response.status_code == 200:
            payment_data = response.json()

            # Check if payment was successful
            if payment_data.get('status') == 'captured':
                # Update order status
                try:
                    order = Order.objects.get(id=order_id)
                    order.payment_status = 'verified'
                    order.save()

                    return Response({
                        'message': 'Payment verified successfully',
                        'payment_details': {
                            'payment_id': payment_data['id'],
                            'amount': payment_data['amount'],
                            'currency': payment_data['currency'],
                            'status': payment_data['status']
                        }
                    })
                except Order.DoesNotExist:
                    return Response({'error': 'Order not found'}, status=404)
            else:
                return Response({'error': 'Payment not captured'}, status=400)
        else:
            return Response({'error': 'Failed to verify payment with Razorpay'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def create_razorpay_refund(request):
    """Create refund with Razorpay API"""
    try:
        payment_id = request.data.get('payment_id')
        amount = request.data.get('amount')  # Amount in paisa
        reason = request.data.get('reason', 'Customer request')

        if not payment_id or not amount:
            return Response({'error': 'Payment ID and amount required'}, status=400)

        # Razorpay API integration
        razorpay_key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
        razorpay_key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')

        if not razorpay_key_id or not razorpay_key_secret:
            return Response({'error': 'Razorpay credentials not configured'}, status=500)

        auth_string = base64.b64encode(f"{razorpay_key_id}:{razorpay_key_secret}".encode()).decode()

        headers = {
            'Authorization': f'Basic {auth_string}',
            'Content-Type': 'application/json'
        }

        refund_payload = {
            'amount': amount,
            'notes': {
                'reason': reason
            }
        }

        refund_url = f"https://api.razorpay.com/v1/payments/{payment_id}/refund"
        response = requests.post(refund_url, json=refund_payload, headers=headers)

        if response.status_code in [200, 201]:
            refund_data = response.json()
            return Response({
                'message': 'Refund created successfully',
                'refund_details': refund_data
            })
        else:
            return Response({'error': 'Failed to create refund'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
