from django.core.management.base import BaseCommand
from store.models import Category, Product


class Command(BaseCommand):
    help = 'Create sample data for YuvaKart'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {
                'name': 'Electronics',
                'description': 'Mobile phones, chargers, and electronic gadgets'
            },
            {
                'name': 'Home & Kitchen',
                'description': 'Household items and kitchen essentials'
            },
            {
                'name': 'Personal Care',
                'description': 'Soaps, shampoos, and personal hygiene products'
            },
            {
                'name': 'Groceries',
                'description': 'Daily essentials and food items'
            }
        ]

        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
            else:
                self.stdout.write(f'Category already exists: {category.name}')

        # Create products
        products_data = [
            {
                'name': 'Samsung Mobile Phone',
                'description': 'Latest Samsung smartphone with advanced features',
                'price': 12999.00,
                'category': categories[0],  # Electronics
                'stock': 15
            },
            {
                'name': 'Power Bank 10000mAh',
                'description': 'High capacity power bank for all your devices',
                'price': 899.00,
                'category': categories[0],  # Electronics
                'stock': 25
            },
            {
                'name': 'Stainless Steel Water Bottle',
                'description': 'Durable water bottle, keeps water cool for hours',
                'price': 299.00,
                'category': categories[1],  # Home & Kitchen
                'stock': 40
            },
            {
                'name': 'Non-Stick Cookware Set',
                'description': 'Complete kitchen set with non-stick coating',
                'price': 1499.00,
                'category': categories[1],  # Home & Kitchen
                'stock': 8
            },
            {
                'name': 'Herbal Shampoo 200ml',
                'description': 'Natural herbal shampoo for healthy hair',
                'price': 185.00,
                'category': categories[2],  # Personal Care
                'stock': 30
            },
            {
                'name': 'Aloe Vera Face Wash',
                'description': 'Gentle face wash with aloe vera for all skin types',
                'price': 125.00,
                'category': categories[2],  # Personal Care
                'stock': 20
            },
            {
                'name': 'Premium Rice 5kg',
                'description': 'High quality basmati rice',
                'price': 325.00,
                'category': categories[3],  # Groceries
                'stock': 50
            },
            {
                'name': 'Cooking Oil 1L',
                'description': 'Pure vegetable cooking oil',
                'price': 145.00,
                'category': categories[3],  # Groceries
                'stock': 35
            }
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
            if created:
                self.stdout.write(f'Created product: {product.name}')
            else:
                self.stdout.write(f'Product already exists: {product.name}')

        self.stdout.write(self.style.SUCCESS('Sample data creation completed!'))
