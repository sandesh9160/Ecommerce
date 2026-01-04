#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

from django.contrib.auth.models import User

def fix_admin_user():
    print("Checking admin user permissions...")

    try:
        # Get or create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@yuvakart.com',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
                'first_name': 'YuvaKart',
                'last_name': 'Admin'
            }
        )

        if created:
            # Set password for new user
            admin_user.set_password('admin123')
            admin_user.save()
            print("✅ Admin user created successfully")
        else:
            # Update existing user permissions
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.is_active = True
            admin_user.set_password('admin123')  # Reset password
            admin_user.save()
            print("✅ Admin user updated with correct permissions")

        print(f"Username: {admin_user.username}")
        print(f"Email: {admin_user.email}")
        print(f"Is staff: {admin_user.is_staff}")
        print(f"Is superuser: {admin_user.is_superuser}")
        print(f"Is active: {admin_user.is_active}")
        print("\n🎯 Admin login credentials:")
        print("URL: http://localhost:3000/admin-login")
        print("Username: admin")
        print("Password: admin123")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
