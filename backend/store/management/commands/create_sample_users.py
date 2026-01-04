from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from store.models import Category, Product

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample users for testing'

    def handle(self, *args, **options):
        # Create sample users
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@yuvakart.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'phone': '9876543210',
                'is_staff': True,
                'is_superuser': True,
                'password': 'admin123'
            },
            {
                'username': 'testuser',
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User',
                'phone': '9876543211',
                'is_staff': False,
                'is_superuser': False,
                'password': 'test123'
            },
            {
                'username': 'customer',
                'email': 'customer@yuvakart.com',
                'first_name': 'Regular',
                'last_name': 'Customer',
                'phone': '9876543212',
                'is_staff': False,
                'is_superuser': False,
                'password': 'customer123'
            }
        ]

        for user_data in users_data:
            password = user_data.pop('password')
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {user.username} ({user.email})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'User already exists: {user.username}')
                )

        self.stdout.write(self.style.SUCCESS('\nSample users created successfully!'))
        self.stdout.write('Admin credentials:')
        self.stdout.write('  Username: admin')
        self.stdout.write('  Password: admin123')
        self.stdout.write('  Email: admin@yuvakart.com')
        self.stdout.write('\nTest User credentials:')
        self.stdout.write('  Username: testuser')
        self.stdout.write('  Password: test123')
        self.stdout.write('  Email: test@example.com')
        self.stdout.write('\nCustomer credentials:')
        self.stdout.write('  Username: customer')
        self.stdout.write('  Password: customer123')
        self.stdout.write('  Email: customer@yuvakart.com')
