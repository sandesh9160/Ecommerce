#!/usr/bin/env python
import os
import sys
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

from store.views import login_view
from django.test import RequestFactory
from django.contrib.auth.models import User

def test_login():
    print("Testing login functionality...")

    # Create a mock request
    factory = RequestFactory()
    data = {'username_or_email': 'admin', 'password': 'admin123'}
    request = factory.post('/api/auth/login/', data=json.dumps(data), content_type='application/json')

    # Parse the JSON data manually
    import json
    request.data = data

    try:
        response = login_view(request)
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")

        if response.status_code == 200:
            print("✅ Login successful!")
        else:
            print("❌ Login failed!")

    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_login()
