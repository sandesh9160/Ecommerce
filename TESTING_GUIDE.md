# YuvaKart E-commerce Testing Guide

## Prerequisites
- Python 3.x installed
- Node.js 18+ installed
- npm or yarn installed

## Quick Start

### 1. Backend Setup & Testing (Terminal 1)

```powershell
# Navigate to backend
cd d:\ClientPro\Ecommerce\backend

# Install dependencies (if not already installed)
pip install django djangorestframework django-cors-headers pillow djangorestframework-simplejwt

# Run migrations
python manage.py migrate

# Create superuser (admin)
# Username: admin
# Email: admin@yuvakart.com
# Password: admin123
python manage.py createsuperuser

# Create sample data
python populate_db.py

# Start backend server
python manage.py runserver
```

Backend will run at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin**
API base: **http://localhost:8000/api/**

---

### 2. Frontend Setup & Testing (Terminal 2)

```powershell
# Navigate to frontend
cd d:\ClientPro\Ecommerce\frontend

# Install dependencies
npm install

# Install framer-motion (for animations)
npm install framer-motion

# Create .env.local file manually or use echo
# echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
# (Windows PowerShell)
New-Item -Path .env.local -ItemType File -Force
Set-Content -Path .env.local -Value "NEXT_PUBLIC_API_URL=http://localhost:8000/api"

# Start frontend dev server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## Testing Checklist

### ✅ Backend API Testing

1. **Categories API**
   ```
   GET http://localhost:8000/api/categories/
   ```
   Expected: List of categories

2. **Products API**
   ```
   GET http://localhost:8000/api/products/
   GET http://localhost:8000/api/products/?category=1
   GET http://localhost:8000/api/products/1/
   ```
   Expected: List of products, filtered products, product detail

3. **UPI Settings API**
   ```
   GET http://localhost:8000/api/upi-settings/
   ```
   Expected: UPI payment details

4. **Authentication API**
   ```
   POST http://localhost:8000/api/auth/register/
   POST http://localhost:8000/api/auth/login/
   ```

---

### ✅ Frontend User Flow Testing

#### **Homepage Testing** (/)
- [ ] Hero banner carousel auto-rotates
- [ ] Categories display properly
- [ ] Products load from API
- [ ] Navigation works
- [ ] Responsive on mobile

#### **User Authentication Testing**
- [] **Register** (/register)
  - [ ] Form validation works
  - [ ] User can register successfully
  - [ ] Redirects after registration
  
- [ ] **Login** (/login)
  - [ ] Form validation works
  - [ ] User can login successfully
  - [ ] Token stored in localStorage
  - [ ] Redirects to homepage
  
- [ ] **Logout**
  - [ ] User can logout
  - [ ] Token cleared from localStorage

#### **Shopping Flow Testing**
- [ ] **Product Detail** (/products/[id])
  - [ ] Product details load
  - [ ] Images display
  - [ ] Add to cart works
  
- [ ] **Cart** (/cart)
  - [ ] Cart items display
  - [ ] Can update quantities
  - [ ] Can remove items
  - [ ] Total calculates correctly
  - [ ] Proceed to checkout works
  
- [ ] **Checkout** (/checkout)
  - [ ] Customer info form works
  - [ ] Address form works
  - [ ] Order summary displays
  - [ ] Can place order
  
- [ ] **Payment** (/payment)
  - [ ] UPI QR code displays
  - [ ] Can upload payment proof
  - [ ] UTR number field works
  - [ ] Redirects to success page
  
- [ ] **Order Success** (/order-success)
  - [ ] Order confirmation displays
  - [ ] Order details shown

#### **Other Pages Testing**
- [ ] About page (/about)
- [ ] Contact page (/contact)
- [ ] FAQ page (/faq)
- [ ] Reviews page (/reviews)
- [ ] Categories page (/categories)

---

### ✅ Admin Panel Testing

#### **Admin Login** (/admin-login)
- [ ] Form validation works
- [ ] Admin can login (must use superuser credentials)
- [ ] Redirects to admin dashboard

#### **Admin Dashboard** (/admin/dashboard)
- [ ] Statistics display
- [ ] Quick actions work
- [ ] Navigation sidebar works

#### **Products Management** (/admin/products)
- [ ] Product list displays
- [ ] Can create new product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Image upload works

#### **Orders Management** (/admin/orders)
- [ ] Order list displays
- [ ] Can view order details
- [ ] Can approve payment
- [ ] Can reject payment
- [ ] Can update order status
- [ ] Payment proof displays

#### **Shipments Management** (/admin/shipments)
- [ ] Shipment list displays
- [ ] Can create shipment
- [ ] Can update tracking info
- [ ] AWB number generates

#### **UPI Settings** (/admin/upi-settings)
- [ ] UPI settings display
- [ ] Can update UPI ID
- [ ] Can upload QR code
- [ ] Can toggle active status

---

## Common Issues & Fixes

### Issue: "Failed to fetch categories"
**Fix:** Ensure backend server is running on port 8000

### Issue: "CORS error"
**Fix:** Check `backend/yuvakart_backend/settings.py` has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Issue: "Images not loading"
**Fix:** Ensure `MEDIA_URL` and `MEDIA_ROOT` configured in Django settings

### Issue: "Framer motion error"
**Fix:** Run `npm install framer-motion`

### Issue: "Admin can't login"
**Fix:** Ensure using superuser credentials, check `is_staff=True`

---

## Test Scenarios

### Scenario 1: Complete User Purchase Flow
1. Browse homepage
2. Click on a product
3. View product details
4. Add to cart
5. Go to cart
6. Proceed to checkout
7. Fill in customer details
8. Place order
9. Make payment (upload screenshot)
10. View order success page

### Scenario 2: Admin Order Management
1. Login as admin
2. Go to orders page
3. View pending orders
4. Check payment proof
5. Approve payment
6. Create shipment
7. Update tracking status

### Scenario 3: Product Management
1. Login as admin
2. Go to products page
3. Create new product
4. Upload product image
5. View product on frontend
6. Edit product details
7. Deactivate/delete product

---

## Performance Testing

- [ ] Homepage loads in < 2 seconds
- [ ] Product images lazy load
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Security Testing

- [ ] API requires authentication where needed
- [ ] Admin routes protected
- [ ] SQL injection protected (Django ORM)
- [ ] XSS protected (React)
- [ ] CSRF tokens work
- [ ] Password hashing works
- [ ] JWT tokens expire correctly

---

## Deployment Checklist (Future)

- [ ] Environment variables set for production
- [ ] DEBUG = False in Django
- [ ] Static files collected
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] CORS updated for production domain
- [ ] Rate limiting added
- [ ] Monitoring setup
- [ ] Error logging configured

---

## Useful Commands

### Backend Django
```powershell
# Run server
python manage.py runserver

# Make migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

### Frontend Next.js
```powershell
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

---

## Next Steps After Testing

1. Fix all identified bugs
2. Add more error handling
3. Improve loading states
4. Add toast notifications
5. Implement password strength meter
6. Add email verification
7. Add SMS notifications
8. Integrate Delhivery API
9. Add analytics
10. SEO optimization
