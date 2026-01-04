#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

from store.models import Order, OrderItem, Product, Category

def create_sample_data():
    print("Creating sample categories, products and orders...")

    # Create sample categories
    categories_data = [
        {'name': 'Electronics', 'description': 'Electronic gadgets and devices'},
        {'name': 'Home & Kitchen', 'description': 'Home and kitchen appliances'},
        {'name': 'Personal Care', 'description': 'Personal care and beauty products'}
    ]

    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories.append(category)
        if created:
            print(f'Created category: {category.name}')

    # Create sample products
    products_data = [
        {'name': 'Samsung Mobile Phone', 'price': 1200, 'stock': 10, 'category': categories[0]},
        {'name': 'Power Bank 10000mAh', 'price': 890, 'stock': 15, 'category': categories[0]},
        {'name': 'Stainless Steel Water Bottle', 'price': 1050, 'stock': 20, 'category': categories[1]},
        {'name': 'Non-Stick Cookware Set', 'price': 500, 'stock': 8, 'category': categories[1]},
        {'name': 'Herbal Shampoo 200ml', 'price': 185, 'stock': 25, 'category': categories[2]}
    ]

    products = []
    for prod_data in products_data:
        product, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'description': f'High quality {prod_data["name"].lower()}',
                'price': prod_data['price'],
                'category': prod_data['category'],
                'stock': prod_data['stock'],
                'is_active': True
            }
        )
        products.append(product)
        if created:
            print(f'Created product: {product.name}')

    # Create sample orders
    orders_data = [
        {
            'customer_name': 'Sunita Patel',
            'customer_phone': '+91 9876543213',
            'customer_email': 'sunita@example.com',
            'shipping_address': '321 Rural Lane, Village Center, District, State - 123459',
            'total_amount': 550,
            'shipping_charge': 50,
            'order_status': 'pending',
            'payment_status': 'pending',
            'product_index': 3,  # Non-Stick Cookware Set
            'quantity': 1
        },
        {
            'customer_name': 'Amit Singh',
            'customer_phone': '+91 9876543212',
            'customer_email': 'amit@example.com',
            'shipping_address': '789 Rural Area, Block, District, State - 123458',
            'total_amount': 2100,
            'shipping_charge': 0,
            'order_status': 'delivered',
            'payment_status': 'verified',
            'product_index': 2,  # Stainless Steel Water Bottle
            'quantity': 2
        },
        {
            'customer_name': 'Priya Sharma',
            'customer_phone': '+91 9876543211',
            'customer_email': 'priya@example.com',
            'shipping_address': '456 Village Road, Mandal, District, State - 123457',
            'total_amount': 890,
            'shipping_charge': 0,
            'order_status': 'shipped',
            'payment_status': 'verified',
            'product_index': 1,  # Power Bank
            'quantity': 1
        }
    ]

    order_id = 21
    for order_data in orders_data:
        product_index = order_data.pop('product_index')
        quantity = order_data.pop('quantity')
        product = products[product_index]

        order, created = Order.objects.get_or_create(
            id=order_id,
            defaults=order_data
        )

        if created:
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
            print(f'Created order: {order.id} - {order.customer_name} - {order.payment_status}')
            order_id += 1

    print("Sample data creation completed successfully!")

if __name__ == '__main__':
    create_sample_data()
