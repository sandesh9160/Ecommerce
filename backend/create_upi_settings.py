#!/usr/bin/env python
import os
import sys
import django
import sqlite3

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yuvakart_backend.settings')
django.setup()

def create_upi_settings_direct():
    """Create UPI settings directly in the database"""
    db_path = 'db.sqlite3'

    if not os.path.exists(db_path):
        print("❌ Database file not found")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if table exists, if not create it
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='store_upisettings';")
        if not cursor.fetchone():
            print("Creating store_upisettings table...")
            cursor.execute("""
                CREATE TABLE store_upisettings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    merchant_name VARCHAR(100) NOT NULL,
                    upi_id VARCHAR(100) NOT NULL,
                    qr_code_image VARCHAR(100) NULL,
                    is_active BOOLEAN NOT NULL,
                    created_at DATETIME NOT NULL,
                    updated_at DATETIME NOT NULL
                );
            """)
            print("Table created successfully")

        # Check if UPI settings already exist
        cursor.execute("SELECT COUNT(*) FROM store_upisettings WHERE merchant_name = 'YuvaKart';")
        count = cursor.fetchone()[0]

        if count == 0:
            # Insert default UPI settings
            cursor.execute("""
                INSERT INTO store_upisettings (merchant_name, upi_id, qr_code_image, is_active, created_at, updated_at)
                VALUES ('YuvaKart', 'merchant@upi', NULL, 1, datetime('now'), datetime('now'));
            """)
            print("Created UPI settings: YuvaKart (merchant@upi)")
        else:
            print("UPI settings already exist")

        conn.commit()
        conn.close()
        print("Database operations completed successfully")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    create_upi_settings_direct()
