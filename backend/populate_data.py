#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

from store.models import Category, Product

def populate_sample_data():
    print("Populating YuvaKart with sample data...")

    # Clear existing data
    Product.objects.all().delete()
    Category.objects.all().delete()

    # Create categories
    categories_data = [
        {'name': 'Electronics', 'description': 'Mobile phones, chargers, and electronic gadgets'},
        {'name': 'Home & Kitchen', 'description': 'Household items and kitchen essentials'},
        {'name': 'Personal Care', 'description': 'Soaps, shampoos, and personal hygiene products'},
        {'name': 'Groceries', 'description': 'Daily essentials and food items'}
    ]

    categories = []
    for cat_data in categories_data:
        category = Category.objects.create(
            name=cat_data['name'],
            description=cat_data['description']
        )
        categories.append(category)
        print(f'[OK] Created category: {category.name}')

    # Create products
    products_data = [
        # Electronics
        {'name': 'Samsung Galaxy M14', 'description': 'Latest Samsung smartphone with 50MP camera', 'price': 14999.00, 'category': categories[0], 'stock': 25},
        {'name': 'Power Bank 20000mAh', 'description': 'Fast charging power bank with multiple ports', 'price': 1299.00, 'category': categories[0], 'stock': 40},
        {'name': 'Wireless Earbuds', 'description': 'Bluetooth earbuds with noise cancellation', 'price': 2499.00, 'category': categories[0], 'stock': 30},
        {'name': 'LED Smart TV 32"', 'description': 'HD LED TV with built-in streaming apps', 'price': 18999.00, 'category': categories[0], 'stock': 15},

        # Home & Kitchen
        {'name': 'Stainless Steel Water Bottle 1L', 'description': 'Insulated water bottle keeps drinks cold for 24 hours', 'price': 399.00, 'category': categories[1], 'stock': 60},
        {'name': 'Non-Stick Cookware Set 7pcs', 'description': 'Complete kitchen set with scratch-resistant coating', 'price': 1999.00, 'category': categories[1], 'stock': 20},
        {'name': 'Cotton Bed Sheets Queen Size', 'description': 'Soft cotton bedsheets with pillow covers', 'price': 899.00, 'category': categories[1], 'stock': 35},
        {'name': 'Plastic Storage Containers 6pcs', 'description': 'Air-tight containers for food storage', 'price': 299.00, 'category': categories[1], 'stock': 50},

        # Personal Care
        {'name': 'Herbal Shampoo 500ml', 'description': 'Natural shampoo for healthy and shiny hair', 'price': 225.00, 'category': categories[2], 'stock': 45},
        {'name': 'Aloe Vera Face Cream 100g', 'description': 'Moisturizing cream for all skin types', 'price': 175.00, 'category': categories[2], 'stock': 40},
        {'name': 'Toothpaste Herbal 200g', 'description': 'Natural toothpaste with neem and pomegranate', 'price': 95.00, 'category': categories[2], 'stock': 80},
        {'name': 'Body Wash 250ml', 'description': 'Gentle body wash with natural ingredients', 'price': 185.00, 'category': categories[2], 'stock': 35},

        # Groceries
        {'name': 'Premium Basmati Rice 5kg', 'description': 'Long grain basmati rice, perfect for biryani', 'price': 425.00, 'category': categories[3], 'stock': 100},
        {'name': 'Cooking Oil 1L', 'description': 'Refined cooking oil for healthy cooking', 'price': 165.00, 'category': categories[3], 'stock': 75},
        {'name': 'Tea Powder 500g', 'description': 'Premium CTC tea powder for perfect brew', 'price': 285.00, 'category': categories[3], 'stock': 40},
        {'name': 'Sugar 2kg', 'description': 'Pure white sugar for household use', 'price': 95.00, 'category': categories[3], 'stock': 90}
    ]

    for prod_data in products_data:
        product = Product.objects.create(
            name=prod_data['name'],
            description=prod_data['description'],
            price=prod_data['price'],
            category=prod_data['category'],
            stock=prod_data['stock'],
            is_active=True
        )
        print(f'[OK] Created product: {product.name}')

    total_products = len(products_data)
    total_categories = len(categories_data)

    print("\n*** Successfully populated YuvaKart database! ***")
    print(f"Created {total_categories} categories")
    print(f"Created {total_products} products")
    print("\nYuvaKart is now ready with sample data!")

if __name__ == '__main__':
    populate_sample_data()
