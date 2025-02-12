# GiggleFest Backend - Microservices REST API Event Ticketing Management System

## Description

GiggleFest Backend is a microservices-based RESTful API service that powers the event ticketing management system. Built with a microservices architecture, the system is divided into independent, specialized services that handle specific business domains. This backend service provides the core infrastructure for the GiggleFest platform, enabling users to discover, purchase, and manage tickets for various events. Built with Node.js and Express, this backend system delivers robust APIs for event organizers to create and manage events, while offering attendees a seamless ticket purchasing experience with secure payment processing and promotional offers. The backend handles all server-side operations including user authentication, database management, payment processing, and email notifications.

## Microservices Architecture

The system is divided into the following microservices:

### User Service

- User authentication and authorization
- Profile management
- Email verification
- User preferences

### Event Service

- Event creation and management
- Category management
- Image handling
- Event search and filtering

### Ticket Service

- Ticket inventory management
- Ticket booking
- QR code generation
- Seat allocation

### Payment Service

- Payment processing
- Refund handling
- Payment gateway integration (Midtrans)
- Transaction history

### Cart Service

- Shopping cart management
- Item reservation
- Price calculation
- Inventory checking

### Notification Service

- Email notifications
- Real-time updates
- System alerts
- Promotional notifications

### Review Service

- User reviews
- Ratings management
- Review moderation
- Analytics

### Promo Service

- Promotional code management
- Discount calculations
- Validity checks
- Campaign management

## Key Features

- Microservices Architecture
- RESTful API Architecture
- Service Discovery and Registry
- Load Balancing
- Circuit Breaker Pattern
- User Authentication & Authorization
- Event Management
- Ticket Booking System
- Shopping Cart Functionality
- Payment Processing (Midtrans Integration)
- Promo Code Management
- Real-time Notifications
- Review & Rating System
- Email Verification System
- Image Upload Management

## Tech Stack

### Core Technologies

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Service Communication**: REST APIs
- **Service Registry**: Consul/Eureka

### Microservices Tools

- **Service Discovery**: Consul
- **Load Balancer**: Nginx
- **API Gateway**: Express Gateway
- **Circuit Breaker**: Hystrix
- **Message Queue**: RabbitMQ
- **Service Mesh**: Istio

### Authentication & Security

- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Input Validation**:
  - Joi
  - Zod

### Payment & Media

- **Payment Gateway**: Midtrans
- **Image Management**: ImageKit

### Email Services

- **Email Handler**: Nodemailer

### API Documentation

- **Documentation**: Swagger/OpenAPI
  - swagger-ui-express
  - swagger-jsdoc

### Utilities

- **Environmental Variables**: dotenv
- **CORS Support**: cors
- **File Upload**: multer
- **Crypto Functions**: crypto

## Project Structure

```
services/
├── user-service/
├── event-service/
├── ticket-service/
├── payment-service/
├── cart-service/
├── notification-service/
├── review-service/
└── promo-service/

Each service:
src/
├── controllers/    # Request handlers
├── routes/        # API routes
├── services/      # Business logic
├── repositories/  # Database operations
├── middlewares/   # Custom middleware
├── utils/         # Helper functions
├── validators/    # Input validation
└── docs/         # API documentation
```

## API Endpoints

- `/api/v1/auth` - Authentication routes
- `/api/v1/users` - User management
- `/api/v1/events` - Event management
- `/api/v1/categories` - Event categories
- `/api/v1/tickets` - Ticket management
- `/api/v1/reviews` - User reviews
- `/api/v1/cart` - Shopping cart
- `/api/v1/payments` - Payment processing
- `/api/v1/promos` - Promotional codes
- `/api/v1/notifications` - User notifications

## Security Features

- Password Hashing
- JWT Authentication
- Rate Limiting
- Input Validation
- CORS Protection
- Environmental Variables
- Service-to-Service Authentication
- API Gateway Security
- Circuit Breaker
- Rate Limiting per Service
