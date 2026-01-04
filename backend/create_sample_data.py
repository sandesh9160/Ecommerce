#!/usr/bin/env python
import os
import sys

# Use the virtual environment's python
venv_python = os.path.join(os.path.dirname(__file__), 'venv', 'Scripts', 'python.exe')
if os.path.exists(venv_python):
    # Re-run this script with venv python
    os.execv(venv_python, [venv_python] + sys.argv)

import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_project.settings')
django.setup()

from store.models import Category, Product

def create_sample_data():
    print("Creating sample data...")

    # Create categories
    categories_data = [
        {'name': 'Electronics', 'description': 'Mobile phones, chargers, and electronic gadgets'},
        {'name': 'Home & Kitchen', 'description': 'Household items and kitchen essentials'},
        {'name': 'Personal Care', 'description': 'Soaps, shampoos, and personal hygiene products'},
        {'name': 'Groceries', 'description': 'Daily essentials and food items'}
    ]

    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories.append(category)
        print(f'Created category: {category.name}' if created else f'Category exists: {category.name}')

    # Create products
    products_data = [
        {'name': 'Samsung Mobile Phone', 'description': 'Latest Samsung smartphone with advanced features', 'price': 12999.00, 'category': categories[0], 'stock': 15},
        {'name': 'Power Bank 10000mAh', 'description': 'High capacity power bank for all your devices', 'price': 899.00, 'category': categories[0], 'stock': 25},
        {'name': 'Stainless Steel Water Bottle', 'description': 'Durable water bottle, keeps water cool for hours', 'price': 299.00, 'category': categories[1], 'stock': 40},
        {'name': 'Non-Stick Cookware Set', 'description': 'Complete kitchen set with non-stick coating', 'price': 1499.00, 'category': categories[1], 'stock': 8},
        {'name': 'Herbal Shampoo 200ml', 'description': 'Natural herbal shampoo for healthy hair', 'price': 185.00, 'category': categories[2], 'stock': 30},
        {'name': 'Aloe Vera Face Wash', 'description': 'Gentle face wash with aloe vera for all skin types', 'price': 125.00, 'category': categories[2], 'stock': 20},
        {'name': 'Premium Rice 5kg', 'description': 'High quality basmati rice', 'price': 325.00, 'category': categories[3], 'stock': 50},
        {'name': 'Cooking Oil 1L', 'description': 'Pure vegetable cooking oil', 'price': 145.00, 'category': categories[3], 'stock': 35}
    ]

    for prod_data in products_data:
        product, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'description': prod_data['description'],
                'price': prod_data['price'],
                'category': prod_data['category'],
                'stock': prod_data['stock']
            }
        )
        print(f'Created product: {product.name}' if created else f'Product exists: {product.name}')

    print('Sample data creation completed!')

if __name__ == '__main__':
    create_sample_data()
