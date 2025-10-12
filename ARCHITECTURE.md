# Architecture Documentation

## 📐 System Architecture

This document provides a comprehensive overview of Nook Link's architecture, design decisions, and technical implementation.

## 🎯 Table of Contents

- [Overview](#overview)
- [Architecture Patterns](#architecture-patterns)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Scalability Considerations](#scalability-considerations)

---

## 🏗️ Overview

Nook Link follows a modern **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React + TypeScript + Tailwind)      │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│          Application Layer              │
│      (Node.js + Express + API)          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│            Data Layer                   │
│      (PostgreSQL + Redis Cache)         │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Modularity**: Components are self-contained and reusable
3. **Scalability**: Horizontal scaling through stateless design
4. **Maintainability**: Clear code structure and documentation
5. **Security First**: Security considerations at every layer
6. **Performance**: Optimized for speed and efficiency

---

## 🎨 Architecture Patterns

### 1. Model-View-Controller (MVC)

```
┌─────────┐      ┌────────────┐      ┌───────┐
│  View   │ ───> │ Controller │ ───> │ Model │
│ (React) │ <─── │  (Express) │ <─── │  (DB) │
└─────────┘      └────────────┘      └───────┘
```

### 2. Repository Pattern

Abstracts data access logic:

```javascript
// Repository Interface
class UserRepository {
  async findById(id) { }
  async findByEmail(email) { }
  async create(userData) { }
  async update(id, userData) { }
  async delete(id) { }
}
```

### 3. Service Layer Pattern

Business logic separated from controllers:

```javascript
// Service Layer
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async registerUser(userData) {
    // Business logic here
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

### 4. Middleware Pattern

Request processing pipeline:

```javascript
app.use(requestLogger);
app.use(authentication);
app.use(authorization);
app.use(rateLimiter);
app.use(errorHandler);
```

---

## 🧩 System Components

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/              # State management (Redux/Context)
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

**Key Technologies:**
- **React 18**: Component-based UI
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client

### Backend Architecture

```
src/
├── controllers/        # Request handlers
├── services/          # Business logic
├── repositories/      # Data access layer
├── models/           # Data models
├── middleware/       # Express middleware
├── routes/           # API routes
├── validators/       # Input validation
├── utils/            # Utility functions
└── config/           # Configuration
```

**Key Technologies:**
- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Primary database
- **Redis**: Caching layer
- **JWT**: Authentication
- **bcrypt**: Password hashing

---

## 🔄 Data Flow

### Request Flow Diagram

```
┌─────────┐
│ Client  │
└────┬────┘
     │ HTTP Request
     ↓
┌─────────────────┐
│ Load Balancer   │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ API Gateway     │  ← Rate Limiting
└────┬────────────┘  ← Authentication
     │
     ↓
┌─────────────────┐
│ Middleware      │  ← Validation
│ Pipeline        │  ← Authorization
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Controller      │  ← Route Handler
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Service Layer   │  ← Business Logic
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Repository      │  ← Data Access
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Database        │  ← PostgreSQL
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Cache           │  ← Redis
└────┬────────────┘
     │
     │ HTTP Response
     ↓
┌─────────┐
│ Client  │
└─────────┘
```

### Authentication Flow

```
1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Token sent to client
5. Client stores token (localStorage/cookie)
6. Client includes token in subsequent requests
7. Server validates token on each request
8. Token refreshed before expiration
```

---

## 🛠️ Technology Stack

### Frontend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| React Router | Routing | 6.x |
| React Query | Data Fetching | 5.x |
| Axios | HTTP Client | 1.x |
| Zod | Validation | 3.x |

### Backend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18.x |
| Express | Web Framework | 4.x |
| TypeScript | Type Safety | 5.x |
| PostgreSQL | Database | 15.x |
| Redis | Cache | 7.x |
| Prisma | ORM | 5.x |
| JWT | Authentication | 9.x |
| Helmet | Security | 7.x |

### DevOps Stack

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local Development |
| GitHub Actions | CI/CD |
| Jest | Testing |
| ESLint | Linting |
| Prettier | Code Formatting |

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User     │       │    Role     │
├─────────────┤       ├─────────────┤
│ id (PK)     │───────│ id (PK)     │
│ email       │   ┌───│ name        │
│ password    │   │   │ permissions │
│ name        │   │   └─────────────┘
│ role_id(FK) │───┘
│ created_at  │
└─────────────┘
       │
       │ 1:N
       │
┌─────────────┐
│   Session   │
├─────────────┤
│ id (PK)     │
│ user_id(FK) │
│ token       │
│ expires_at  │
└─────────────┘
```

### Key Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
```

#### Roles Table
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 API Design

### RESTful API Structure

```
/api/v1/
  ├── /auth
  │   ├── POST   /register
  │   ├── POST   /login
  │   ├── POST   /logout
  │   ├── POST   /refresh-token
  │   └── POST   /forgot-password
  │
  ├── /users
  │   ├── GET    /users              # List users (admin)
  │   ├── GET    /users/:id          # Get user by ID
  │   ├── POST   /users              # Create user (admin)
  │   ├── PUT    /users/:id          # Update user
  │   ├── DELETE /users/:id          # Delete user
  │   └── GET    /users/me           # Get current user
  │
  ├── /profile
  │   ├── GET    /profile            # Get profile
  │   ├── PUT    /profile            # Update profile
  │   └── POST   /profile/avatar     # Upload avatar
  │
  └── /resources
      ├── GET    /resources          # List resources
      ├── GET    /resources/:id      # Get resource
      ├── POST   /resources          # Create resource
      ├── PUT    /resources/:id      # Update resource
      └── DELETE /resources/:id      # Delete resource
```

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "statusCode": 400
}
```

### API Versioning

- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Backwards Compatibility**: v1 supported for 6 months after v2 release
- **Deprecation Notice**: Sent 3 months before removal

---

## 🔒 Security Architecture

### Security Layers

```
┌─────────────────────────────────────┐
│     Layer 1: Network Security       │
│  (Firewall, DDoS Protection, CDN)   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Layer 2: API Gateway            │
│  (Rate Limiting, IP Filtering)      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Layer 3: Authentication         │
│  (JWT Validation, Session Mgmt)     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Layer 4: Authorization          │
│  (RBAC, Permissions Check)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Layer 5: Data Validation        │
│  (Input Sanitization, Validation)   │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Layer 6: Data Access            │
│  (Query Sanitization, Encryption)   │
└─────────────────────────────────────┘
```

### Authentication Implementation

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;  // Issued at
  exp: number;  // Expiration
}

// Token Generation
const generateToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
};

// Token Verification Middleware
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### Authorization (RBAC)

```typescript
// Permission System
enum Permission {
  READ_USER = 'read:user',
  WRITE_USER = 'write:user',
  DELETE_USER = 'delete:user',
  ADMIN = 'admin'
}

// Role Definitions
const roles = {
  user: [Permission.READ_USER],
  moderator: [Permission.READ_USER, Permission.WRITE_USER],
  admin: [Permission.READ_USER, Permission.WRITE_USER, Permission.DELETE_USER, Permission.ADMIN]
};

// Authorization Middleware
const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const userPermissions = roles[userRole] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

---

## 🚀 Deployment Architecture

### Production Architecture

```
                    [Users]
                       ↓
              [CDN (Cloudflare)]
                       ↓
            [Load Balancer (AWS ELB)]
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
  [App Server 1]            [App Server 2]
         ↓                           ↓
         └─────────────┬─────────────┘
                       ↓
            [Database Cluster]
          ┌─────────────┴─────────────┐
          ↓                           ↓
    [Primary DB]                [Replica DB]
          ↓
    [Redis Cache]
```

### Deployment Environments

#### Development
```yaml
environment: development
server_count: 1
database: PostgreSQL (local)
cache: Redis (local)
monitoring: Basic logging
```

#### Staging
```yaml
environment: staging
server_count: 2
database: PostgreSQL (managed)
cache: Redis (managed)
monitoring: Full observability
```

#### Production
```yaml
environment: production
server_count: 3+ (auto-scaling)
database: PostgreSQL (HA cluster)
cache: Redis (cluster mode)
monitoring: Full observability + alerting
cdn: Cloudflare
```

### Container Architecture

```dockerfile
# Multi-stage Docker Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linter
      - Run tests
      - Generate coverage report

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker image
      - Run security scan
      - Push to registry

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy to staging
      - Run smoke tests
      - Deploy to production
      - Health check
```

---

## 📊 Scalability Considerations

### Horizontal Scaling

**Application Layer:**
- Stateless application servers
- Load balancing across multiple instances
- Auto-scaling based on CPU/memory metrics

**Database Layer:**
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization and indexing

**Caching Layer:**
- Redis cluster for distributed caching
- Cache invalidation strategies
- CDN for static assets

### Performance Optimization

#### Database Optimization

```sql
-- Indexing Strategy
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

-- Partitioning (for large tables)
CREATE TABLE logs_2025_01 PARTITION OF logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

#### Caching Strategy

```typescript
// Cache-aside pattern
async function getUser(userId: string): Promise<User> {
  // Check cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - fetch from database
  const user = await database.users.findById(userId);
  
  // Store in cache
  await redis.setex(
    `user:${userId}`,
    3600, // 1 hour TTL
    JSON.stringify(user)
  );
  
  return user;
}
```

#### API Response Optimization

```typescript
// Pagination
interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Field selection
interface FieldSelection {
  fields?: string[]; // ['id', 'name', 'email']
}

// Query optimization
async function getUsers(options: PaginationOptions & FieldSelection) {
  const { page = 1, limit = 10, fields } = options;
  const skip = (page - 1) * limit;
  
  const query = database.users.findMany({
    skip,
    take: limit,
    select: fields ? fields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {}) : undefined
  });
  
  return query;
}
```

### Monitoring and Observability

```typescript
// Metrics Collection
interface Metrics {
  requestCount: number;
  errorCount: number;
  responseTime: number;
  activeConnections: number;
}

// Logging Structure
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  traceId: string;
  message: string;
  metadata?: Record<string, any>;
}

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      memory: checkMemory()
    }
  };
  
  const status = health.checks.database && health.checks.cache 
    ? 200 
    : 503;
    
  res.status(status).json(health);
});
```

---

## 🔄 Data Synchronization

### Event-Driven Architecture

```typescript
// Event Bus Pattern
interface Event {
  type: string;
  payload: any;
  timestamp: Date;
}

class EventBus {
  private handlers: Map<string, Function[]> = new Map();
  
  subscribe(eventType: string, handler: Function) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
  
  async publish(event: Event) {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(h => h(event)));
  }
}

// Usage Example
eventBus.subscribe('user.created', async (event) => {
  await emailService.sendWelcomeEmail(event.payload.email);
  await analyticsService.trackSignup(event.payload);
});
```

---

## 📝 Decision Log

### Architecture Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| PostgreSQL over MongoDB | Need for ACID compliance and complex relationships | 2025-01 |
| JWT over sessions | Stateless authentication for scalability | 2025-01 |
| TypeScript | Type safety and better developer experience | 2025-01 |
| Microservices deferred | Monolith first for faster development | 2025-01 |
| Redis for caching | High performance and proven reliability | 2025-02 |

---

## 🔮 Future Improvements

### Roadmap

1. **Q1 2026**
   - Implement GraphQL API
   - Add WebSocket support
   - Enhanced analytics dashboard

2. **Q2 2026**
   - Microservices migration (if needed)
   - Kubernetes deployment
   - Multi-region support

3. **Q3 2026**
   - Machine learning integration
   - Advanced caching strategies
   - Performance optimization v2

---

## 📚 References

- [12-Factor App Methodology](https://12factor.net/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Architecture Patterns](https://reactjs.org/docs/thinking-in-react.html)

---

**Document Version**: 1.0  
**Last Updated**: October 12, 2025  
**Maintainer**: Development Team
