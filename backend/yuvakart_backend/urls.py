"""
URL configuration for yuvakart_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from store import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'addresses', views.AddressViewSet)
router.register(r'upi-settings', views.UPISettingsViewSet)

# Admin routers
admin_router = DefaultRouter()
admin_router.register(r'categories', views.AdminCategoryViewSet)
admin_router.register(r'products', views.AdminProductViewSet)
admin_router.register(r'orders', views.AdminOrderViewSet)
admin_router.register(r'shipments', views.AdminShipmentViewSet)
admin_router.register(r'upi-settings', views.UPISettingsViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/admin/', include(admin_router.urls)),
    # Authentication URLs
    path('api/auth/register/', views.register_view, name='register'),
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/password-reset/', views.password_reset_request_view, name='password-reset'),
    path('api/auth/password-reset-confirm/', views.password_reset_confirm_view, name='password-reset-confirm'),
    path('api/auth/profile/', views.user_profile_view, name='user-profile'),
    path('api/auth/profile/update/', views.update_profile_view, name='update-profile'),
    # Admin specific endpoints
    path('api/admin/dashboard-stats/', views.admin_dashboard_stats_view, name='admin-dashboard-stats'),
    path('api/admin/verify-payment/', views.verify_razorpay_payment, name='verify-payment'),
    path('api/admin/create-refund/', views.create_razorpay_refund, name='create-refund'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
