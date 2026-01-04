# YuvaKart - E-Commerce Demo Platform

A cost-effective, fully functional demo e-commerce platform built with Next.js (frontend) and Django REST Framework (backend), designed for deployment on Railway and Vercel.

## 🎯 Overview

YuvaKart is a production-ready e-commerce demo that showcases real user flows with test/sandbox integrations to keep costs minimal. The platform includes user authentication, product management, shopping cart, Razorpay payment integration, and admin panel functionality.

## 🏗️ Architecture

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, and Framer Motion
- **Backend**: Django 5.1 with Django REST Framework and JWT authentication
- **Database**: PostgreSQL (Railway) / SQLite (development)
- **Payment**: Razorpay Test Mode integration
- **Deployment**: Railway (backend) + Vercel (frontend)

## 🚀 Features

### Customer Features
- User registration and login with JWT authentication
- Product browsing with categories and search
- Shopping cart with local storage persistence
- Secure checkout with Razorpay payment gateway
- Order tracking and history
- Address management
- Password reset functionality

### Admin Features
- Dashboard with sales analytics
- Product and category management
- Order management and status updates
- User management
- Payment verification
- Shipment tracking (mock Delhivery integration)

### Technical Features
- Responsive design with modern UI
- JWT token refresh handling
- Cart synchronization on login
- API rate limiting and security
- Environment-based configuration
- Static file serving with WhiteNoise

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (for production)
- Git

## 🔧 Local Development Setup

### Backend Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd yuvakart
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database setup:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create sample data:**
   ```bash
   python manage.py create_sample_data
   python manage.py create_sample_users
   ```

6. **Create admin user:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

### Backend (.env file in project root)

```bash
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=yuvakart_db
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host
DATABASE_PORT=5432

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Delhivery Configuration (Demo)
DELHIVERY_API_KEY=your_delhivery_api_key
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## 🚀 Deployment

### Railway (Backend)

1. **Connect GitHub repository to Railway**
2. **Configure environment variables in Railway dashboard**
3. **Add PostgreSQL plugin to your Railway project**
4. **Deploy automatically on git push**

### Vercel (Frontend)

1. **Connect GitHub repository to Vercel**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Add environment variables in Vercel dashboard**
4. **Deploy automatically on git push**

## 💳 Payment Integration

### Razorpay Test Mode Setup

1. **Create Razorpay account** at https://razorpay.com
2. **Get test API keys** from Dashboard > Settings > API Keys
3. **Configure webhook** for payment verification (optional for demo)
4. **Test payments** using test cards provided by Razorpay

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002

## 📊 Admin Panel

Access the Django admin panel at `/admin/` with superuser credentials.

### Key Admin Features:
- Manage products and categories
- View and update orders
- Process payments
- Create shipments
- User management

## 🧪 Testing

### Running Tests

```bash
# Backend tests
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Demo User Accounts

**Admin User:**
- Username: admin
- Password: admin123

**Customer User:**
- Email: customer@example.com
- Password: customer123

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with Django's auth system
- CORS configuration
- Input validation and sanitization
- SQL injection protection
- XSS protection
- CSRF protection

## 📈 Performance Optimizations

- Database query optimization
- Static file caching with WhiteNoise
- API response caching
- Image optimization
- Lazy loading components
- Code splitting

## 🐛 Demo Limitations

⚠️ **Important Notes for Demo Use:**

1. **Payment Processing**: Uses Razorpay test mode - no real money transactions
2. **Email Notifications**: Uses console backend in development
3. **Shipping Integration**: Mock Delhivery API - no real shipments
4. **File Uploads**: Local storage only (use cloud storage for production)
5. **Database**: SQLite for development, PostgreSQL for production
6. **Caching**: No Redis caching implemented
7. **Background Jobs**: No Celery/async task processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for demonstration purposes. See LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@yuvakart.com
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)

## 🎉 Acknowledgments

- Next.js team for the amazing React framework
- Django community for the robust web framework
- Razorpay for payment gateway services
- Vercel and Railway for hosting platforms
