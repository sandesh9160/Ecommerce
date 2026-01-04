#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create or update admin user
user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@yuvakart.com',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True
    }
)

# Set password and privileges
user.set_password('admin123')
user.is_staff = True
user.is_superuser = True
user.is_active = True
user.save()

print(f'✓ Admin user {"created" if created else "updated"} successfully!')
print(f'  Username: admin')
print(f'  Password: admin123')
print(f'  is_staff: {user.is_staff}')
print(f'  is_superuser: {user.is_superuser}')
print(f'  is_active: {user.is_active}')
