# MusicECom - Server Application

A Node.js/Express.js backend server for the MusicECom application, providing API endpoints for product management, user authentication, and payment processing. This server handles the business logic and data persistence for the music e-commerce platform.

## 🚀 Features

- **RESTful API**: Clean API endpoints for frontend integration
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Product Management**: CRUD operations for albums and merchandise
- **Payment Processing**: Stripe integration for secure transactions
- **Database Integration**: PostgreSQL for data persistence
- **CORS Support**: Cross-origin resource sharing configuration
- **Environment Configuration**: Secure environment variable management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Processing**: Stripe
- **Environment Management**: dotenv
- **CORS**: cors middleware

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MusicECom/mecserver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/musicecom

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb musicecom

   # Run database migrations (if you have them)
   # npm run migrate
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3001`

## 🏗️ Project Structure

```
mecserver/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── package-lock.json      # Dependency lock file
└── README.md             # This file
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/:id` - Get order by ID (protected)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### Health Check
- `GET /api/health` - Server health status

## 🔐 Authentication

The server uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users register with email and password
2. **Login**: Returns JWT token on successful authentication
3. **Protected Routes**: Include JWT token in Authorization header
4. **Token Format**: `Bearer <jwt_token>`

### Example Authentication Flow
```javascript
// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## 💳 Payment Integration

The server integrates with Stripe for payment processing:

### Payment Flow
1. **Create Payment Intent**: Generate Stripe payment intent
2. **Client Confirmation**: Frontend confirms payment with Stripe
3. **Webhook Handling**: Process payment completion
4. **Order Creation**: Create order record in database

### Stripe Webhook Events
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `checkout.session.completed` - Checkout session completed

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  preview_url VARCHAR(500),
  category VARCHAR(100),
  inventory INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_payment_intent_id VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (if configured)
- `npm test` - Run tests (if configured)

### Adding New Endpoints
1. Define route in `server.js`
2. Add appropriate middleware (auth, validation)
3. Implement business logic
4. Add error handling
5. Update API documentation

### Example Route Implementation
```javascript
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/musicecom
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Options
- **Heroku**: Easy deployment with PostgreSQL addon
- **Railway**: Modern deployment platform
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2, ECS, or Lambda
- **Google Cloud**: Cloud Run or Compute Engine

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Security Considerations

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Secure secret keys and expiration
- **CORS Configuration**: Restrict origins in production
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **Rate Limiting**: Implement rate limiting for API endpoints
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Never commit secrets to version control

## 📊 Monitoring & Logging

### Recommended Additions
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting
- **Health Checks**: Application health monitoring

## 🧪 Testing

### Test Structure (Recommended)
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── fixtures/       # Test data
└── helpers/        # Test utilities
```

### Example Test
```javascript
const request = require('supertest');
const app = require('../server');

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@thomasmatthewgibson.com or create an issue in this repository.

## 🔄 Future Enhancements

- [ ] Database migrations system
- [ ] Comprehensive test suite
- [ ] API documentation with Swagger
- [ ] Caching with Redis
- [ ] File upload for product images
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-tenant support
- [ ] GraphQL API option
