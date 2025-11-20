# 🍕 Hello Cafe Delivery

A comprehensive full-stack cafe delivery management system built with modern web technologies, featuring real-time order processing, payment integration, and role-based access control.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Redis](https://img.shields.io/badge/Redis-7.0-red)
![Stripe](https://img.shields.io/badge/Stripe-Payment-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Payment Integration](#-payment-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Customer Features
- 🔐 **User Authentication & Registration** with JWT tokens
- 🛒 **Shopping Cart Management** with real-time updates
- ❤️ **Favorites System** for saved menu items
- 📍 **Address Book** for multiple delivery addresses
- 📦 **Order Placement & Tracking** with status updates
- 💳 **Secure Payment Processing** via Stripe
- 📱 **Responsive Design** for mobile compatibility

### Admin Features
- 👥 **Admin Dashboard** with comprehensive analytics
- 🍕 **Menu Management** (categories, items, combos)
- 📊 **Order Management** with real-time updates
- 👤 **User Management** system
- 📈 **Sales Reports & Analytics**
- 🖼️ **Image Management** via Cloudinary
- 🏪 **Employee Management** system

### Technical Features
- 🚀 **High Performance** with Redis caching
- 🔒 **Secure Authentication** with role-based access
- 🌐 **CORS Enabled** for cross-origin requests
- 📝 **Automatic Database Auditing** with timestamps
- 🔄 **JWT Token Refresh** mechanism
- 🎯 **TypeScript Support** for better code quality

## 🏗️ Architecture

### Backend (Spring Boot 3.5.6)
- **Multi-module Maven structure** with clean architecture
- **Three main modules**:
  - `hello-cafe-common`: Shared utilities and security
  - `hello-cafe-pojo`: Domain entities and DTOs
  - `hello-cafe-server`: Main application logic

### Frontend (React 19.1.1 + Vite)
- **Modern React** with functional components and hooks
- **Vite Build Tool** for fast development
- **Role-based Component Structure**
- **Axios** for API communication

### Database & Storage
- **MySQL 8.0+** for primary data storage
- **Redis** for caching and session management
- **Cloudinary** for image storage and optimization

## 📁 Project Structure

```
hello-cafe-delivery/
├── hello-cafe-api/                     # Spring Boot Backend
│   ├── hello-cafe-common/              # Shared utilities
│   ├── hello-cafe-pojo/                 # Domain entities
│   └── hello-cafe-server/              # Main application
│       └── src/main/java/com/yuan/
│           ├── controller/             # REST controllers
│           ├── service/                # Service interfaces
│           ├── service/impl/           # Service implementations
│           ├── repository/             # Data repositories
│           ├── entity/                 # JPA entities
│           ├── config/                 # Configuration classes
│           └── security/               # Security components
├── hello-cafe-app/                     # React Frontend
│   ├── src/
│   │   ├── api/                       # API service functions
│   │   ├── components/                # Reusable components
│   │   ├── views/
│   │   │   ├── user/pages/           # User-facing pages
│   │   │   └── admin/pages/          # Admin pages
│   │   ├── layouts/                   # Layout components
│   │   ├── hooks/                     # Custom React hooks
│   │   └── utils/                     # Utility functions
│   └── package.json                   # Dependencies
└── README.md                          # This file
```

## 🔧 Prerequisites

- **Java 17** (required for Spring Boot 3.5.6)
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Redis** server
- **Stripe Account** (for payment processing)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hello-cafe-delivery
```

### 2. Database Setup
```sql
CREATE DATABASE hello_cafe_db;
```

### 3. Backend Setup
```bash
cd hello-cafe-api
mvn clean install
```

### 4. Frontend Setup
```bash
cd hello-cafe-app
npm install
```

## ⚙️ Configuration

### Environment Variables

#### Backend (`application.yml`)
```yaml
# Database Configuration
hello-cafe:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    host: localhost
    port: 3306
    database: hello_cafe_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# Redis Configuration
  redis:
    host: localhost
    port: 6379

# JWT Configuration
  jwt:
    admin-secret-key: ${ADMIN_JWT_SECRET}
    user-secret-key: ${USER_JWT_SECRET}

# Cloudinary Configuration
  cloudinary:
    cloud-name: ${CLOUDINARY_CLOUD_NAME}
    api-key: ${CLOUDINARY_API_KEY}
    api-secret: ${CLOUDINARY_API_SECRET}

# Stripe Configuration
stripe:
  secret-key: ${STRIPE_SECRET_KEY}
  webhook:
    secret: ${STRIPE_WEBHOOK_SECRET}
```

#### Frontend (`.env`)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_BACKEND_URL=http://localhost:8080
```

### Running the Application

#### Backend
```bash
cd hello-cafe-api
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

#### Frontend
```bash
cd hello-cafe-app
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📚 API Documentation

### Authentication
```
POST   /api/auth/login                 # User/Admin login
POST   /api/auth/register              # User registration
POST   /api/auth/refresh-token         # Refresh JWT token
```

### User Management
```
GET    /api/user/profile              # Get user profile
PUT    /api/user/profile              # Update user profile
GET    /api/user/address-book         # Get user addresses
POST   /api/user/address-book         # Add new address
GET    /api/user/favorites            # Get favorite items
POST   /api/user/favorites            # Add to favorites
```

### Shopping Cart & Orders
```
GET    /api/user/shopping-cart/list   # Get cart items
POST   /api/user/shopping-cart/add    # Add to cart
DELETE /api/user/shopping-cart/clean   # Clear cart
GET    /api/user/orders              # Get user orders
POST   /api/user/orders              # Create new order
```

### Admin Management
```
GET    /api/admin/categories        # Get categories
POST   /api/admin/categories        # Create category
GET    /api/admin/menu-items        # Get menu items
POST   /api/admin/menu-items        # Create menu item
GET    /api/admin/combos            # Get combos
POST   /api/admin/combos            # Create combo
GET    /api/admin/orders            # Get all orders
PUT    /api/admin/orders/{id}       # Update order status
```

### Payment
```
POST   /api/payment/create-payment-intent    # Create Stripe PaymentIntent
POST   /api/payment/create-checkout-session  # Create Stripe Checkout
POST   /api/payment/confirm-payment          # Confirm payment
POST   /api/payment/webhook                  # Stripe webhook
```

## 🗄️ Database Schema

### Core Entities

#### Users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    name VARCHAR(32),
    phone VARCHAR(15),
    gender VARCHAR(10),
    avatar VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    number VARCHAR(50) UNIQUE NOT NULL,
    status INT DEFAULT 1, -- 1:pending, 2:awaiting, 3:accepted, 4:delivering, 5:completed
    user_id BIGINT,
    amount DECIMAL(10,2),
    pay_method INT, -- 1:credit card, 2:cash
    pay_status INT DEFAULT 0, -- 0:unpaid, 1:paid
    stripe_payment_intent_id VARCHAR(255),
    payment_time DATETIME,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Menu Items
```sql
CREATE TABLE menu_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) UNIQUE NOT NULL,
    category_id BIGINT,
    price DECIMAL(10,2),
    image VARCHAR(255),
    description TEXT,
    status INT DEFAULT 1 -- 1:active, 0:inactive
);
```

## 💳 Payment Integration

### Stripe Integration
The system integrates with Stripe for secure payment processing:

- **PaymentIntents** for direct card payments
- **Checkout Sessions** for redirect-based payments
- **Webhooks** for payment status updates
- **Test Card Support** for development

### Test Cards
```
Visa:        4242 4242 4242 4242 | Any future date | Any 3 digits |
Mastercard:  5555 5555 5555 4444 | Any future date | Any 3 digits |
Declined:    4000 0000 0000 9995 | Any future date | Any 3 digits |
```

### Webhook Events
- `payment_intent.succeeded` - Update order to paid
- `payment_intent.payment_failed` - Mark order as failed
- `checkout.session.completed` - Process checkout completion

## 🧪 Testing

### Backend Testing
```bash
cd hello-cafe-api
mvn test                    # Run all tests
mvn test -Dtest=UserService # Run specific test class
```

### Frontend Testing
```bash
cd hello-cafe-app
npm test                    # Run React tests
npm run test:coverage       # Generate coverage report
```


