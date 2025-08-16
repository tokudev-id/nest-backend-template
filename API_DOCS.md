# 📚 NestJS Template API Documentation

## 🚀 Overview

The NestJS Template API is a comprehensive RESTful API for managing template articles, comments, and likes with JWT authentication. This documentation provides detailed information about all endpoints, request/response structures, and edge cases.

## 🔗 Connection Details

### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://toku-template.torikul.my.id/api/v1
```

### Authentication
The API uses **Bearer Token** authentication with JWT tokens.

```http
Authorization: Bearer <your-jwt-token>
```

### Content Type
All requests should include:
```http
Content-Type: application/json
Accept: application/json
```

### Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

## 📋 API Endpoints

---

## 🔐 Authentication

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profilePictureUrl": "https://example.com/profile.jpg"
}
```

**Validation Rules:**
- `name`: Required, string, min 2 characters, max 50 characters
- `email`: Required, valid email format, unique
- `password`: Required, string, min 6 characters
- `profilePictureUrl`: Optional, valid URL format (only validated if provided)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": null,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 409 - Email already exists
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 400 - Validation error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, string

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 400 - Validation error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. External Register User

**Endpoint:** `POST /auth/register/external`

**Description:** Register or login user using external provider (Toku, Google, Facebook, GitHub)

**Authentication:** Not required

**Request Body:**
```json
{
  "provider": "toku",
  "accessToken": "your_external_access_token"
}
```

**Validation Rules:**
- `provider`: Required, enum value (toku, google, facebook, github)
- `accessToken`: Required, string, valid access token from external provider

**Success Response (200):**
```json
{
  "success": true,
  "message": "External registration successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Invalid access token
{
  "statusCode": 401,
  "message": "Invalid access token",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 400 - Validation error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 500 - External provider error
{
  "statusCode": 500,
  "message": "Failed to get user info from [provider]",
  "error": "Internal Server Error",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Test JWT Authentication

**Endpoint:** `GET /auth/test`

**Description:** Test if JWT token is valid

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "JWT authentication successful",
  "data": {
    "user": {
      "userId": 1,
      "email": "john@example.com"
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Invalid or expired token
{
  "statusCode": 401,
  "message": "Invalid token or token expired",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 👤 User Profile

### 1. Get User Profile

**Endpoint:** `GET /user-profile`

**Description:** Get current user's profile information

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profilePictureUrl": "https://example.com/profile.jpg",
    "externalAccountId": "123456789",
    "externalProvider": "toku",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "totalComments": 15,
    "totalLikes": 42,
    "totalArticlesPublished": 8
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 404 - User not found
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Update User Profile

**Endpoint:** `PUT /user-profile`

**Description:** Update current user's profile information

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "profilePictureUrl": "https://example.com/new-profile.jpg"
}
```

**Validation Rules:**
- `name`: Optional, string, min 2 characters, max 50 characters
- `profilePictureUrl`: Optional, valid URL format (only validated if provided)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "profilePictureUrl": "https://example.com/new-profile.jpg",
    "externalAccountId": "123456789",
    "externalProvider": "toku",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 404 - User not found
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 400 - Validation error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 📝 Articles

### 1. Create Article

**Endpoint:** `POST /articles`

**Description:** Create a new article

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Amazing Template to Bali",
  "content": "This is my incredible template experience to Bali. The beaches were beautiful and the culture was amazing!",
  "summary": "A comprehensive guide to exploring Bali's best beaches and cultural sites",
  "country": "Indonesia",
  "city": "Bali",
  "tags": ["beach", "culture", "adventure"],
  "images": ["https://example.com/bali-beach1.jpg", "https://example.com/bali-temple.jpg"],
  "templateDate": "2024-06-15",
  "duration": 7,
  "isPublished": true
}
```

**Validation Rules:**
- `title`: Required, string, min 3 characters, max 200 characters
- `content`: Required, string, min 10 characters
- `summary`: Optional, string, min 10 characters
- `country`: Optional, string
- `city`: Optional, string
- `tags`: Optional, array of strings
- `images`: Optional, array of string URLs
- `templateDate`: Optional, valid date string (YYYY-MM-DD)
- `duration`: Optional, integer, min 1, max 365 (days)
- `isPublished`: Optional, boolean, default false

**Success Response (201):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Template to Bali",
    "content": "This is my incredible template experience to Bali...",
    "author": {
      "id": 1,
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "likesCount": 0,
    "isLiked": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 400 - Validation error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Get All Articles

**Endpoint:** `GET /articles`

**Description:** Get paginated list of articles with like information

**Authentication:** Optional (Bearer Token for like status)

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)

**Request Examples:**
```http
# Without authentication
GET /articles?page=1&limit=10

# With authentication (includes like status)
GET /articles?page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "My Amazing Template to Bali",
      "content": "This is my incredible template experience...",
      "author": {
        "id": 1,
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "likesCount": 5,
      "isLiked": true
    }
  ],
  "meta": {
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Note:** `isLiked` field is only included when user is authenticated.

### 3. Get Article by ID

**Endpoint:** `GET /articles/{id}`

**Description:** Get a specific article by ID

**Authentication:** Optional (Bearer Token for like status)

**Path Parameters:**
- `id`: Article ID (integer)

**Request Examples:**
```http
# Without authentication
GET /articles/1

# With authentication (includes like status)
GET /articles/1
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article retrieved successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Template to Bali",
    "content": "This is my incredible template experience...",
    "author": {
      "id": 1,
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "likesCount": 5,
    "isLiked": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Update Article

**Endpoint:** `PATCH /articles/{id}`

**Description:** Update an article (author only)

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `id`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Template to Bali",
  "content": "Updated content about my amazing Bali adventure!"
}
```

**Validation Rules:**
- `title`: Optional, string, min 3 characters, max 200 characters
- `content`: Optional, string, min 10 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Template to Bali",
    "content": "Updated content about my amazing Bali adventure!",
    "author": {
      "id": 1,
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z",
    "likesCount": 5,
    "isLiked": true
  },
  "timestamp": "2024-01-01T12:30:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 403 - Not the author
{
  "statusCode": 403,
  "message": "You are not the author",
  "error": "Forbidden",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 5. Delete Article

**Endpoint:** `DELETE /articles/{id}`

**Description:** Delete an article (author only)

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `id`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article deleted successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Template to Bali",
    "content": "This is my incredible template experience...",
    "author": {
      "id": 1,
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 403 - Not the author
{
  "statusCode": 403,
  "message": "You are not the author",
  "error": "Forbidden",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 💬 Comments

### 1. Create Comment

**Endpoint:** `POST /articles/{articleId}/comments`

**Description:** Create a comment on an article

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Great article! I love Bali too! The beaches are absolutely stunning."
}
```

**Validation Rules:**
- `content`: Required, string, min 1 character, max 1000 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 1,
    "content": "Great article! I love Bali too!",
    "author": {
      "id": 2,
      "email": "alice@example.com"
    },
    "article": {
      "id": 1,
      "title": "My Amazing Template to Bali"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Get Comments

**Endpoint:** `GET /articles/{articleId}/comments`

**Description:** Get paginated list of comments for an article

**Authentication:** Not required

**Path Parameters:**
- `articleId`: Article ID (integer)

**Query Parameters:**
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)

**Request Example:**
```http
GET /articles/1/comments?page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": 1,
      "content": "Great article! I love Bali too!",
      "author": {
        "id": 2,
        "email": "alice@example.com"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Update Comment

**Endpoint:** `PATCH /articles/{articleId}/comments/{commentId}`

**Description:** Update a comment (author only)

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)
- `commentId`: Comment ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated comment content - I really enjoyed reading about your Bali adventure!"
}
```

**Validation Rules:**
- `content`: Required, string, min 1 character, max 1000 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 1,
    "content": "Updated comment content - I really enjoyed reading about your Bali adventure!",
    "author": {
      "id": 2,
      "email": "alice@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  },
  "timestamp": "2024-01-01T12:30:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Comment not found
{
  "statusCode": 404,
  "message": "Comment not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 403 - Not the author
{
  "statusCode": 403,
  "message": "Not your comment",
  "error": "Forbidden",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Delete Comment

**Endpoint:** `DELETE /articles/{articleId}/comments/{commentId}`

**Description:** Delete a comment (author only)

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)
- `commentId`: Comment ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {
    "id": 1,
    "content": "Great article! I love Bali too!",
    "author": {
      "id": 2,
      "email": "alice@example.com"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Comment not found
{
  "statusCode": 404,
  "message": "Comment not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 403 - Not the author
{
  "statusCode": 403,
  "message": "Not your comment",
  "error": "Forbidden",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## ❤️ Likes

### 1. Like Article

**Endpoint:** `POST /articles/{articleId}/likes`

**Description:** Like an article

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Article liked successfully",
  "data": {
    "id": 1,
    "user": {
      "id": 2,
      "email": "alice@example.com"
    },
    "article": {
      "id": 1,
      "title": "My Amazing Template to Bali"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 409 - Already liked
{
  "statusCode": 409,
  "message": "Article already liked",
  "error": "Conflict",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Unlike Article

**Endpoint:** `DELETE /articles/{articleId}/likes`

**Description:** Unlike an article

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article unliked successfully",
  "data": {
    "message": "Article unliked successfully"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Like not found
{
  "statusCode": 404,
  "message": "Like not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Get Likes Count

**Endpoint:** `GET /articles/{articleId}/likes/count`

**Description:** Get the total number of likes for an article

**Authentication:** Not required

**Path Parameters:**
- `articleId`: Article ID (integer)

**Request Example:**
```http
GET /articles/1/likes/count
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Likes count retrieved successfully",
  "data": {
    "likesCount": 5
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Check Like Status

**Endpoint:** `GET /articles/{articleId}/likes/status`

**Description:** Check if current user has liked the article

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `articleId`: Article ID (integer)

**Request Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Like status retrieved successfully",
  "data": {
    "isLiked": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
```json
// 404 - Article not found
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🔧 Health Check

### Health Check

**Endpoint:** `GET /health`

**Description:** Check API health status

**Authentication:** Not required

**Request Example:**
```http
GET /health
```

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

---

## 📊 Response Structure

### Success Response Format
All successful responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response Format
All error responses follow this structure:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Error type",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Pagination Format
Paginated responses include metadata:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ /* array of items */ ],
  "meta": {
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🚨 Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., already liked) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 🔒 Security Considerations

### Authentication
- JWT tokens expire after 7 days
- Tokens are invalidated on logout
- Sensitive data is never returned in responses

### Rate Limiting
- 100 requests per 15 minutes per IP
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Input Validation
- All inputs are validated using class-validator
- SQL injection protection via TypeORM
- XSS protection via input sanitization

### Error Handling
- No sensitive information in error responses
- Detailed logging for debugging
- Graceful error handling

---

## 📝 Testing Examples

### cURL Examples

**Register User:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Article:**
```bash
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Template Story",
    "content": "This is my amazing template experience..."
  }'
```

**Get Articles:**
```bash
curl -X GET "http://localhost:3000/api/v1/articles?page=1&limit=10"
```

**Like Article:**
```bash
curl -X POST http://localhost:3000/api/v1/articles/1/likes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

**Using Fetch API:**
```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { data: { access_token } } = await loginResponse.json();

// Create Article
const articleResponse = await fetch('http://localhost:3000/api/v1/articles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Template Story',
    content: 'This is my amazing template experience...'
  })
});
```

---

## 🔄 WebSocket Support

Currently, the API does not support WebSocket connections. All communication is done via HTTP REST endpoints.

---

## 📈 Performance Considerations

### Pagination
- Always use pagination for large datasets
- Default limit is 10 items per page
- Maximum limit is 100 items per page

### Caching
- Consider implementing client-side caching
- Use ETags for conditional requests
- Cache static content appropriately

### Rate Limiting
- Respect rate limits to avoid 429 errors
- Implement exponential backoff for retries
- Monitor rate limit headers

---

## 🆘 Troubleshooting

### Common Issues

**1. 401 Unauthorized**
- Check if JWT token is valid and not expired
- Ensure token is in correct format: `Bearer <token>`
- Verify token was obtained from login endpoint

**2. 404 Not Found**
- Verify the resource ID exists
- Check the correct endpoint URL
- Ensure proper path parameters

**3. 409 Conflict**
- Usually occurs when trying to like an already liked article
- Check if resource already exists before creating

**4. 429 Too Many Requests**
- Wait for rate limit to reset
- Implement exponential backoff
- Reduce request frequency

### Debug Tips

1. **Check Response Headers** for rate limit information
2. **Use the test endpoint** to verify JWT token validity
3. **Check server logs** for detailed error information
4. **Validate request format** using the examples above
5. **Test with Postman collection** for easy debugging

---

## 📞 Support

For additional support:
- Check the Swagger documentation at `/api/docs`
- Review server logs for detailed error information
- Use the provided Postman collection for testing
- Open an issue on the project repository

---

*Last updated: July 2025* 