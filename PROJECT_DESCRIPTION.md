# YuvaKart E-Commerce Platform - Complete Project Description

## 📋 Project Overview

**YuvaKart** is a modern, full-stack e-commerce platform specifically designed for rural and semi-urban India. The platform bridges the digital divide by providing a user-friendly online shopping experience tailored to the needs of rural communities, featuring UPI-only payments, WhatsApp notifications, and simplified checkout processes.

### Project Name
**YuvaKart** - Smart Shopping, Easy Living

### Target Audience
- Rural and semi-urban communities in India
- Small town retailers and consumers
- Users comfortable with UPI payments

### Key Value Proposition
- Simple UPI-based payment system (no cards required)
- Local delivery with real-time tracking
- Mobile-first responsive design
- Support for regional languages (expandable)
- WhatsApp-based order updates

---

## 🏗️ Architecture Overview

### Technology Stack

#### **Backend (Django REST Framework)**
- **Framework**: Django 5.1.7
- **API**: Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite3 (Development) / PostgreSQL (Production-ready)
- **Image Handling**: Pillow
- **CORS**: django-cors-headers
- **Language**: Python 3.x

#### **Frontend (Next.js + React)**
- **Framework**: Next.js 16.0.10 (App Router)
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Language**: TypeScript 5.x
- **Build Tool**: Next.js with Turbopack

#### **Infrastructure**
- **Development Server**: Django Development Server (Port 8000)
- **Frontend Dev Server**: Next.js Dev Server (Port 3000)
- **File Storage**: Local media storage (expandable to cloud)
- **Payment Integration**: UPI (Manual verification with QR codes)

---

## 🎯 Core Features

### 1. **User Features**

#### Authentication & Profile Management
- ✅ User registration with email/username
- ✅ Secure login (username or email)
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Multiple address management (Home, Work, Other)
- ✅ JWT-based authentication

#### Shopping Experience
- ✅ Browse products by category
- ✅ Product search and filtering
- ✅ Product details with images
- ✅ Shopping cart (localStorage-based)
- ✅ Wishlist functionality
- ✅ Product reviews and ratings display

#### Checkout & Payment
- ✅ Multi-step checkout process
- ✅ Address selection/creation
- ✅ Order summary
- ✅ UPI QR code payment
- ✅ Payment proof upload (screenshot + UTR number)
- ✅ Order confirmation

#### Order Management
- ✅ Order history
- ✅ Real-time order tracking
- ✅ Shipment tracking with AWB number
- ✅ Order status updates (Pending → Verified → Shipped → Delivered)

### 2. **Admin Features**

#### Admin Dashboard
- ✅ Overview statistics (Total Orders, Revenue, Active Products)
- ✅ Recent orders summary
- ✅ Quick action buttons

#### Product Management
- ✅ Create/Edit/Delete products
- ✅ Image upload for products
- ✅ Category management
- ✅ Stock management
- ✅ Product activation/deactivation

#### Order Management
- ✅ View all orders
- ✅ Filter by status
- ✅ Payment verification (view proof, approve/reject)
- ✅ Order status updates
- ✅ Customer details view

#### Shipment Management
- ✅ Create shipments for verified orders
- ✅ Generate AWB numbers
- ✅ Update tracking information
- ✅ Shipment status management
- ✅ Integration-ready for Delhivery API

#### Payment Settings
- ✅ UPI settings management
- ✅ QR code upload
- ✅ Merchant details configuration

### 3. **Informational Pages**
- ✅ About Us
- ✅ Contact Form
- ✅ FAQ Section
- ✅ Customer Reviews
- ✅ Categories Overview

---

## 📊 Database Schema

### Models Overview

#### **User Model** (Extended AbstractUser)
```
- id (AutoField)
- username (CharField)
- email (EmailField)
- password (hashed)
- first_name, last_name (CharField)
- phone (CharField)
- date_of_birth (DateField)
- address (TextField)
- is_staff, is_superuser (BooleanField)
```

#### **Category Model**
```
- id (AutoField)
- name (CharField, unique)
- description (TextField)
- image (ImageField)
- created_at, updated_at (DateTimeField)
```

#### **Product Model**
```
- id (AutoField)
- name (CharField)
- description (TextField)
- price (DecimalField)
- image (ImageField)
- category (ForeignKey to Category)
- stock (PositiveIntegerField)
- is_active (BooleanField)
- created_at, updated_at (DateTimeField)
```

#### **Order Model**
```
- id (AutoField)
- customer_name, customer_phone, customer_email
- shipping_address (TextField)
- total_amount, shipping_charge (DecimalField)
- order_status (CharField: pending/payment_verified/shipped/delivered/cancelled)
- payment_status (CharField: pending/verified/rejected)
- created_at, updated_at (DateTimeField)
```

#### **OrderItem Model**
```
- id (AutoField)
- order (ForeignKey to Order)
- product (ForeignKey to Product)
- quantity (PositiveIntegerField)
- price (DecimalField - at time of order)
```

#### **PaymentProof Model**
```
- id (AutoField)
- order (OneToOneField to Order)
- image (ImageField)
- utr_number (CharField)
- uploaded_at (DateTimeField)
```

#### **Shipment Model**
```
- id (AutoField)
- order (OneToOneField to Order)
- awb_number (CharField, unique)
- tracking_url (URLField)
- status (CharField: pending/picked_up/in_transit/out_for_delivery/delivered/failed)
- created_at, updated_at (DateTimeField)
```

#### **Address Model**
```
- id (AutoField)
- user (ForeignKey to User)
- address_type (CharField: home/work/other)
- apartment_flat, street, landmark, village, mandal
- district, state, pincode
- full_address (TextField)
- is_default (BooleanField)
- created_at, updated_at (DateTimeField)
```

#### **UPISettings Model**
```
- id (AutoField)
- merchant_name (CharField)
- upi_id (CharField)
- qr_code_image (ImageField)
- is_active (BooleanField)
- created_at, updated_at (DateTimeField)
```

---

## 🔌 API Endpoints

### Base URL
**Development**: `http://localhost:8000/api/`

### Public Endpoints

#### Authentication
```
POST   /api/auth/register/              - User registration
POST   /api/auth/login/                 - User login (returns JWT tokens)
POST   /api/auth/password-reset/        - Request password reset
POST   /api/auth/password-reset-confirm/ - Confirm password reset
GET    /api/auth/profile/               - Get user profile (authenticated)
PUT    /api/auth/profile/update/        - Update user profile (authenticated)
```

#### Categories
```
GET    /api/categories/                 - List all categories
GET    /api/categories/{id}/            - Get category details
```

#### Products
```
GET    /api/products/                   - List all products (with optional category filter)
GET    /api/products/{id}/              - Get product details
```

#### Orders (Authenticated Users)
```
GET    /api/orders/                     - List user's orders
POST   /api/orders/                     - Create new order
GET    /api/orders/{id}/                - Get order details
POST   /api/orders/{id}/upload-payment/ - Upload payment proof
```

#### Addresses (Authenticated Users)
```
GET    /api/addresses/                  - List user's addresses
POST   /api/addresses/                  - Create new address
GET    /api/addresses/{id}/             - Get address details
PUT    /api/addresses/{id}/             - Update address
DELETE /api/addresses/{id}/             - Delete address
```

#### UPI Settings
```
GET    /api/upi-settings/               - Get active UPI payment settings
```

### Admin Endpoints (Staff Only)

#### Admin Categories
```
GET    /api/admin/categories/           - List all categories
POST   /api/admin/categories/           - Create category
PUT    /api/admin/categories/{id}/      - Update category
DELETE /api/admin/categories/{id}/      - Delete category
```

#### Admin Products
```
GET    /api/admin/products/             - List all products
POST   /api/admin/products/             - Create product
PUT    /api/admin/products/{id}/        - Update product
DELETE /api/admin/products/{id}/        - Delete product
```

#### Admin Orders
```
GET    /api/admin/orders/               - List all orders
GET    /api/admin/orders/{id}/          - Get order details
POST   /api/admin/orders/{id}/approve-payment/  - Approve payment
POST   /api/admin/orders/{id}/reject-payment/   - Reject payment
PUT    /api/admin/orders/{id}/update-status/    - Update order status
```

#### Admin Shipments
```
GET    /api/admin/shipments/            - List all shipments
POST   /api/admin/shipments/            - Create shipment
PUT    /api/admin/shipments/{id}/       - Update shipment
GET    /api/admin/shipments/{id}/       - Get shipment details
```

#### Admin UPI Settings
```
GET    /api/admin/upi-settings/         - List UPI settings
POST   /api/admin/upi-settings/         - Create UPI settings
PUT    /api/admin/upi-settings/{id}/    - Update UPI settings
```

---

## 🎨 Frontend Structure

### Pages (App Router)

#### Public Pages
- `/` - Homepage (Hero carousel, categories, featured products, FAQ)
- `/about` - About YuvaKart
- `/contact` - Contact form
- `/faq` - Frequently Asked Questions
- `/reviews` - Customer reviews
- `/categories` - All categories overview
- `/products/[id]` - Product detail page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request

#### User Pages (Authenticated)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/payment` - Payment upload
- `/order-success` - Order confirmation
- `/order-tracking` - Track orders
- `/dashboard` - User dashboard

#### Admin Pages (Staff Only)
- `/admin-login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/shipments` - Shipment management
- `/admin/upi-settings` - UPI settings

### Components

#### Core Components
- `Header.tsx` - Navigation header with cart, user menu
- `ProductCard.tsx` - Reusable product card
- `Footer` - Site footer (integrated in pages)

#### UI Components (Shadcn-inspired)
- `Card.tsx` - Card container
- `Button.tsx` - Button component
- `Badge.tsx` - Badge/label component
- `Input.tsx` - Form input
- `Select.tsx` - Dropdown select

### API Service (`lib/api.ts`)
Centralized API client with:
- Axios instance with base URL configuration
- JWT token interceptors
- Token refresh logic
- Typed API methods for all endpoints

---

## 🎯 User Flows

### Customer Purchase Flow
1. Browse homepage or categories
2. Click on product → View details
3. Add to cart
4. Proceed to checkout
5. Enter/select shipping address
6. Review order summary
7. Submit order
8. Redirected to payment page
9. Scan UPI QR code and make payment
10. Upload payment screenshot + UTR number
11. Receive order confirmation
12. Track order status

### Admin Order Processing Flow
1. Login to admin panel
2. View pending orders
3. Check payment proof
4. Approve/reject payment
5. If approved, create shipment
6. Generate AWB number
7. Update shipment status as it progresses
8. Mark order as delivered

---

## 🔐 Security Features

### Authentication & Authorization
- ✅ JWT-based authentication with access & refresh tokens
- ✅ Password hashing (Django's built-in)
- ✅ CSRF protection
- ✅ Role-based access control (User vs Admin)
- ✅ Protected routes on frontend

### Data Security
- ✅ SQL injection protection (Django ORM)
- ✅ XSS protection (React)
- ✅ CORS configuration
- ✅ Secure file upload validation

---

## 📱 Responsive Design

### Mobile-First Approach
- Fully responsive design using Tailwind CSS
- Optimized for mobile devices (320px and up)
- Touch-friendly UI elements
- Hamburger menu for mobile navigation
- Bottom sheet modals for mobile

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

---

## 🎨 Design System

### Color Palette
- **Primary**: Green shades (representing trust, growth)
- **Secondary**: Blue shades (reliability)
- **Accent**: Purple (premium feel)
- **Success**: Green
- **Error**: Red
- **Warning**: Yellow

### Typography
- Font Family: System fonts (optimized for performance)
- Headings: Bold, large sizes
- Body: Regular weight, readable sizes

### Animations
- Framer Motion for smooth page transitions
- Hover effects on cards and buttons
- Loading spinners
- Carousel auto-scroll
- Stagger animations for lists

---

## 🚀 Deployment Considerations

### Backend Deployment
**Recommended Stack**: Django + Gunicorn + Nginx + PostgreSQL

**Environment Variables Needed**:
```
DEBUG=False
SECRET_KEY=<your-secret-key>
ALLOWED_HOSTS=<your-domain>
DATABASE_URL=<postgres-url>
MEDIA_ROOT=/media/
STATIC_ROOT=/static/
CORS_ALLOWED_ORIGINS=<frontend-url>
```

**Steps**:
1. Set `DEBUG=False`
2. Configure PostgreSQL database
3. Collect static files: `python manage.py collectstatic`
4. Run migrations: `python manage.py migrate`
5. Set up Gunicorn with supervisor
6. Configure Nginx as reverse proxy
7. Set up SSL certificate (Let's Encrypt)

### Frontend Deployment
**Recommended Platform**: Vercel / Netlify / AWS Amplify

**Environment Variables Needed**:
```
NEXT_PUBLIC_API_URL=<backend-api-url>
```

**Steps**:
1. Build production bundle: `npm run build`
2. Test production build: `npm run start`
3. Deploy to platform
4. Configure custom domain
5. Enable HTTPS

### File Storage
**Options**:
- Development: Local filesystem
- Production: AWS S3 / Cloudinary / DigitalOcean Spaces

### Future Integrations
- **Delhivery API**: Automated shipment creation and tracking
- **SMS Gateway**: Order notifications via SMS
- **WhatsApp Business API**: Order updates via WhatsApp
- **Firebase**: Push notifications
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring

---

## 📊 Performance Optimizations

### Frontend
- ✅ Next.js Image optimization
- ✅ Lazy loading for images
- ✅ Code splitting (automatic with Next.js)
- ✅ Prefetching for links
- ✅ CSS-in-JS optimization
- ✅ Service worker (future)

### Backend
- ✅ Database query optimization
- ✅ Django caching (future)
- ✅ CDN for static files (production)
- ✅ Image compression
- ✅ API response pagination

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for models
- API endpoint tests
- Authentication tests
- Payment flow tests

### Frontend Testing
- Component tests (Jest + React Testing Library)
- E2E tests (Playwright/Cypress)
- Visual regression tests
- Performance testing (Lighthouse)

### Manual Testing Checklist
See `TESTING_GUIDE.md` for comprehensive testing workflows

---

## 📈 Analytics & Monitoring

### Metrics to Track
- User registrations
- Order conversion rate
- Average order value
- Payment approval rate
- Cart abandonment rate
- Popular products/categories
- Traffic sources
- Page load times

### Recommended Tools
- Google Analytics 4
- Hotjar (heatmaps)
- Sentry (error tracking)
- LogRocket (session replay)

---

## 🔄 Development Workflow

### Backend Development
```bash
cd backend/
python manage.py runserver
```

### Frontend Development
```bash
cd frontend/
npm run dev
```

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python populate_db.py
```

---

## 📝 Future Enhancements

### Phase 2 Features
- [ ] Product recommendations (AI-based)
- [ ] Multi-vendor marketplace
- [ ] Loyalty points program
- [ ] Referral system
- [ ] Regional language support (Hindi, Telugu, Tamil)
- [ ] Voice search
- [ ] Product comparison
- [ ] Advanced filters (price range, brand, rating)

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Live chat support
- [ ] Video product demonstrations
- [ ] Social media integration
- [ ] Subscription-based products
- [ ] Gift cards
- [ ] Bulk ordering for retailers
- [ ] Seller dashboard

---

## 👥 Team & Contribution

### Project Maintainers
- Development Team: YuvaKart Dev Team

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software developed for YuvaKart.

---

## 📞 Support & Contact

### Technical Support
- Email: support@yuvakart.com
- Phone: [To be added]
- WhatsApp: [To be added]

### Documentation
- Testing Guide: `TESTING_GUIDE.md`
- Frontend Completion Plan: `FRONTEND_COMPLETION_PLAN.md`
- API Documentation: [To be generated with Swagger]

---

## ✅ Project Status

### Completed ✅
- ✅ Backend API (100%)
- ✅ Database models and migrations
- ✅ Authentication system (JWT)
- ✅ Frontend pages (95%)
- ✅ Admin panel
- ✅ Payment flow
- ✅ Order management
- ✅ Responsive design

### In Progress 🔄
- 🔄 Cart state management (localStorage)
- 🔄 Complete testing
- 🔄 Error handling improvements
- 🔄 Loading states optimization

### Planned 📋
- 📋 Deployment to production
- 📋 Delhivery API integration
- 📋 WhatsApp notifications
- 📋 Performance optimization
- 📋 SEO optimization
- 📋 PWA features

---

## 🎓 Technical Documentation

### Key Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 5.1.7 | Backend framework |
| Django REST Framework | Latest | API development |
| Next.js | 16.0.10 | Frontend framework |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | Latest | Animations |
| JWT | Latest | Authentication |
| SQLite3 | - | Development database |

### Environment Setup

#### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn
- Git

#### Backend Setup
```bash
cd backend/
pip install django djangorestframework django-cors-headers pillow djangorestframework-simplejwt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend/
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

---

**Last Updated**: December 25, 2024  
**Version**: 1.0.0  
**Status**: Development Complete, Ready for Testing & Deployment
