#!/usr/bin/env python
"""
Script to populate the database with sample data
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_project.settings')
django.setup()

from store.models import Category, Product

def populate_data():
    print("Populating database with sample data...")

    # Create categories
    categories_data = [
        {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
        {'name': 'Books', 'description': 'Books and educational materials'},
        {'name': 'Fashion', 'description': 'Clothing and fashion accessories'},
        {'name': 'Home & Kitchen', 'description': 'Home and kitchen appliances'},
        {'name': 'Sports', 'description': 'Sports and fitness equipment'},
        {'name': 'Beauty', 'description': 'Beauty and personal care products'},
    ]

    categories = []
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories.append(cat)
        if created:
            print(f'Created category: {cat.name}')

    # Create products
    products_data = [
        {'name': 'Samsung Galaxy M14', 'price': 14999, 'category': categories[0], 'stock': 50, 'description': 'Latest smartphone with advanced features'},
        {'name': 'Dell Inspiron Laptop', 'price': 45000, 'category': categories[0], 'stock': 25, 'description': 'Powerful laptop for work and entertainment'},
        {'name': 'Python Programming Book', 'price': 599, 'category': categories[1], 'stock': 100, 'description': 'Comprehensive guide to Python programming'},
        {'name': 'Data Science Handbook', 'price': 899, 'category': categories[1], 'stock': 75, 'description': 'Complete guide to data science'},
        {'name': 'Cotton T-Shirt', 'price': 299, 'category': categories[2], 'stock': 200, 'description': 'Comfortable cotton t-shirt'},
        {'name': 'Running Shoes', 'price': 1999, 'category': categories[2], 'stock': 80, 'description': 'High-quality running shoes'},
        {'name': 'Stainless Steel Water Bottle', 'price': 399, 'category': categories[3], 'stock': 150, 'description': 'Insulated water bottle'},
        {'name': 'Non-Stick Cookware Set', 'price': 1999, 'category': categories[3], 'stock': 30, 'description': 'Complete cookware set'},
        {'name': 'Yoga Mat', 'price': 899, 'category': categories[4], 'stock': 60, 'description': 'High-quality yoga mat'},
        {'name': 'Dumbbells Set', 'price': 2499, 'category': categories[4], 'stock': 40, 'description': 'Adjustable dumbbells for home workouts'},
        {'name': 'Herbal Shampoo', 'price': 225, 'category': categories[5], 'stock': 120, 'description': 'Natural herbal shampoo'},
        {'name': 'Face Cream', 'price': 349, 'category': categories[5], 'stock': 90, 'description': 'Moisturizing face cream'},
    ]

    for prod_data in products_data:
        prod, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'price': prod_data['price'],
                'category': prod_data['category'],
                'stock': prod_data['stock'],
                'description': prod_data['description'],
                # Don't set image field to avoid 404 errors
                'is_active': True
            }
        )
        if created:
            print(f'Created product: {prod.name}')

    print("Sample data populated successfully!")
    print(f"   Categories: {Category.objects.count()}")
    print(f"   Products: {Product.objects.count()}")

if __name__ == '__main__':
    populate_data()
