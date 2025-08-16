# 🚀 NestJS Backend Template

A clean NestJS template with PostgreSQL and TypeORM, focused on user authentication and profile management. This template provides a production-ready foundation for building backend services with industry-standard security features.

## 🛠 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: class-validator & class-transformer

## 📋 Features

### ✅ User Services
- User registration with email validation
- User login with JWT token generation
- Password hashing with bcrypt
- JWT strategy and guards
- User profile management

### ✅ Production Features
- Rate limiting (100 requests per 15 minutes)
- Global exception handling
- Health check endpoint
- Database migrations
- Docker containerization
- Nginx reverse proxy
- Comprehensive logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### 🐳 Using Docker (Recommended)

#### Option 1: Production Setup
```bash
# Clone the repository
git clone https://github.com/tokudev-id/nest-backend-template.git
cd nest-backend-template

# Start all services (API, PostgreSQL, Nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Development Setup
```bash
# Clone the repository
git clone https://github.com/tokudev-id/nest-backend-template.git
cd nest-backend-template

# Start development environment
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f api

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

#### Access the Application
- **API Base URL**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create environment files
   cp environment/.env.example environment/.env.local
   # Edit the environment file with your database credentials
   ```

3. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=nestpass -e POSTGRES_USER=nestuser -e POSTGRES_DB=template-app -p 5432:5432 -d postgres:15-alpine
   ```

4. **Run migrations**
   ```bash
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   npm run start:dev
   ```

## 📚 API Documentation

### 📖 Interactive Documentation
- **Swagger UI**: http://localhost:3000/api/docs
- **Postman Collection**: Import `NestJS-Template.postman_collection.json` into Postman

### 📋 Detailed API Reference
For a complete list of all API endpoints with detailed request/response examples, see:
- **[API_DOCS.md](./API_DOCS.md)** - Comprehensive API documentation

### 🔑 Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 👤 User Profile Endpoints

#### Get User Profile
```http
GET /api/v1/users/me
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```http
PATCH /api/v1/users/me
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```





## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start with debugger

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Testing
npm run test               # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run migration:show     # Show migration status

# Docker
npm run docker:build       # Build Docker image
npm run docker:run         # Run Docker container
npm run docker:compose:up  # Start all services
npm run docker:compose:down # Stop all services

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Environment Variables

Create environment files in the `environment/` directory:

```bash
# .env.local (Development)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=nestuser
POSTGRES_PASSWORD=nestpass
POSTGRES_DB=template-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=local
PORT=3000
LOG_LEVEL=debug

# .env.production (Production)
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=nestuser
POSTGRES_PASSWORD=nestpass
POSTGRES_DB=template-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

## 🚀 Deployment

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **For production, update environment variables**
   ```bash
   # Edit docker-compose.yml with production values
   # Update JWT_SECRET, database credentials, etc.
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up production database**
   ```bash
   npm run migration:run
   ```

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: 100 requests per 15 minutes per user/IP
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Error Handling**: Secure error responses without sensitive data
- **SQL Injection Protection**: TypeORM with parameterized queries

## 📊 Monitoring

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Logging
The application uses structured logging with different levels:
- `debug`: Development debugging
- `info`: General application logs
- `warn`: Warning messages
- `error`: Error messages with stack traces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](http://localhost:3000/api/docs)
2. Review the logs: `docker-compose logs -f`
3. Open an issue on GitHub

---

**Built with ❤️ using NestJS**