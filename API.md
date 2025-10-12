# API Documentation

Complete API reference for Nook Link

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Resources](#resource-endpoints)
- [Webhooks](#webhooks)
- [SDKs](#sdks)
- [Changelog](#api-changelog)

---

## 🌐 Overview

**Base URL**: `https://api.nooklink.com/v1`

**API Version**: v1

**Response Format**: JSON

**Request Methods**: GET, POST, PUT, PATCH, DELETE

### API Principles

- RESTful architecture
- HTTPS only
- JSON request/response bodies
- Standard HTTP status codes
- Versioned API (URL versioning)

---

## 🔐 Authentication

### Bearer Token Authentication

All API requests require authentication using a Bearer token in the Authorization header.

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Obtaining an Access Token

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

### Token Refresh

Tokens expire after 15 minutes. Use the refresh token to obtain a new access token.

**Request:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

---

## ⏱️ Rate Limiting

API requests are rate-limited to prevent abuse.

### Limits

| Tier | Requests per Hour | Requests per Day |
|------|-------------------|------------------|
| Free | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Enterprise | 10,000 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 15 minutes.",
    "retryAfter": 900
  },
  "statusCode": 429
}
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
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

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## 📚 Endpoints

### Authentication Endpoints

#### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-12T10:00:00Z"
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `confirmPassword`: Must match password

---

#### Login

Authenticate a user and receive tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "tokenType": "Bearer",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### Logout

Invalidate the current access token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Forgot Password

Request a password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### Reset Password

Reset password using the token from email.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### User Endpoints

#### Get Current User

Retrieve authenticated user's profile.

**Endpoint:** `GET /users/me`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "emailVerified": true,
    "createdAt": "2025-10-12T10:00:00Z",
    "updatedAt": "2025-10-12T10:00:00Z"
  }
}
```

---

#### Update User Profile

Update authenticated user's profile information.

**Endpoint:** `PUT /users/me`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Software developer",
  "location": "New York, USA"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "bio": "Software developer",
    "location": "New York, USA",
    "updatedAt": "2025-10-12T11:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

#### Upload Avatar

Upload a profile avatar image.

**Endpoint:** `POST /users/me/avatar`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

**Request Body:**
```
avatar: [file]
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.nooklink.com/avatars/uuid.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

**Constraints:**
- Maximum file size: 5MB
- Allowed formats: JPG, PNG, GIF
- Image will be resized to 500x500px

---

#### List Users

List all users (admin only).

**Endpoint:** `GET /users`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 100): Items per page
- `sort` (string, default: 'createdAt'): Sort field
- `order` (string, default: 'desc'): Sort order (asc, desc)
- `search` (string): Search by name or email
- `role` (string): Filter by role

**Example:**
```http
GET /users?page=1&limit=20&sort=name&order=asc&role=user
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-10-12T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### Get User by ID

Retrieve a specific user (admin only or own profile).

**Endpoint:** `GET /users/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer",
    "location": "New York, USA",
    "createdAt": "2025-10-12T10:00:00Z",
    "updatedAt": "2025-10-12T10:00:00Z"
  }
}
```

---

#### Delete User

Delete a user account (admin only or own account).

**Endpoint:** `DELETE /users/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `204 No Content`

---

### Resource Endpoints

#### List Resources

Retrieve a paginated list of resources.

**Endpoint:** `GET /resources`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page
- `sort` (string): Sort field
- `order` (string): Sort order
- `category` (string): Filter by category
- `status` (string): Filter by status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Resource Title",
      "description": "Resource description",
      "category": "technology",
      "status": "active",
      "createdBy": {
        "id": "uuid",
        "name": "John Doe"
      },
      "createdAt": "2025-10-12T10:00:00Z",
      "updatedAt": "2025-10-12T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

#### Get Resource

Retrieve a specific resource by ID.

**Endpoint:** `GET /resources/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Resource Title",
    "description": "Detailed description of the resource",
    "content": "Full content here...",
    "category": "technology",
    "tags": ["nodejs", "api", "backend"],
    "status": "active",
    "views": 1234,
    "createdBy": {
      "id": "uuid",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "createdAt": "2025-10-12T10:00:00Z",
    "updatedAt": "2025-10-12T10:00:00Z"
  }
}
```

---

#### Create Resource

Create a new resource.

**Endpoint:** `POST /resources`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Resource",
  "description": "Description of the resource",
  "content": "Full content...",
  "category": "technology",
  "tags": ["nodejs", "api"],
  "status": "active"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Resource",
    "description": "Description of the resource",
    "category": "technology",
    "status": "active",
    "createdAt": "2025-10-12T12:00:00Z"
  },
  "message": "Resource created successfully"
}
```

**Validation Rules:**
- `title`: Required, 3-200 characters
- `description`: Required, 10-500 characters
- `content`: Optional, max 10,000 characters
- `category`: Required, must be valid category
- `tags`: Optional, array of strings
- `status`: Required, one of: active, draft, archived

---

#### Update Resource

Update an existing resource.

**Endpoint:** `PUT /resources/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Resource Title",
  "description": "Updated description",
  "content": "Updated content...",
  "tags": ["updated", "tags"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Resource Title",
    "description": "Updated description",
    "updatedAt": "2025-10-12T13:00:00Z"
  },
  "message": "Resource updated successfully"
}
```

---

#### Delete Resource

Delete a resource.

**Endpoint:** `DELETE /resources/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:** `204 No Content`

---

## 🔔 Webhooks

### Registering Webhooks

**Endpoint:** `POST /webhooks`

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["user.created", "resource.updated"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

| Event | Description |
|-------|-------------|
| `user.created` | New user registered |
| `user.updated` | User profile updated |
| `user.deleted` | User account deleted |
| `resource.created` | New resource created |
| `resource.updated` | Resource updated |
| `resource.deleted` | Resource deleted |

### Webhook Payload

```json
{
  "event": "user.created",
  "timestamp": "2025-10-12T10:00:00Z",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Webhook Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

---

## 📦 SDKs

### JavaScript/TypeScript

```bash
npm install @nooklink/sdk
```

```typescript
import { NookLinkClient } from '@nooklink/sdk';

const client = new NookLinkClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.nooklink.com/v1'
});

// Get current user
const user = await client.users.me();

// Create resource
const resource = await client.resources.create({
  title: 'New Resource',
  description: 'Description'
});
```

### Python

```bash
pip install nooklink
```

```python
from nooklink import NookLinkClient

client = NookLinkClient(api_key='your-api-key')

# Get current user
user = client.users.me()

# Create resource
resource = client.resources.create(
    title='New Resource',
    description='Description'
)
```

---

## 📝 API Changelog

### v1.0.0 (2025-10-12)
- Initial API release
- User authentication and management
- Resource CRUD operations
- Webhook support

---

## 📞 Support

- **API Documentation**: https://docs.nooklink.com
- **Status Page**: https://status.nooklink.com
- **Support Email**: api-support@nooklink.com

---

**API Version**: 1.0  
**Last Updated**: October 12, 2025
