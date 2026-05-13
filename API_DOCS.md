# OTG Global Mobility REST API Documentation

## Project Overview

OTG Global Mobility Backend is a comprehensive REST API built with Node.js, Express.js, and MongoDB. It provides endpoints for managing users, services, testimonials, inquiries, and email communications. The API uses JWT-based authentication with access and refresh tokens stored in HTTP-only cookies.

**Base URL**: `http://localhost:5000`  
**API Version**: `/otg/api/v1`

---

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/otg_global_mobility

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=7d

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Run the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

---

## Authentication System

### JWT Strategy

- **Access Token**: Short-lived (15m), sent in HTTP-only cookie named `accessToken`
- **Refresh Token**: Long-lived (7d), sent in HTTP-only cookie named `refreshToken`, stored in database
- **Cookie Options**: `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`

### Token Flow

1. User logs in → receives both access and refresh tokens in cookies
2. Access token is used for authenticated requests
3. When access token expires, use refresh token to get a new access token
4. Refresh token is validated against the stored token in the database

---

## API Routes

### Authentication Routes: `/otg/api/v1/auth`

| Method | Endpoint       | Access  | Description                    |
|--------|----------------|---------|--------------------------------|
| POST   | /register      | Admin   | Register a new user            |
| POST   | /login         | Public  | Login user                     |
| POST   | /logout        | Private | Logout and clear cookies       |
| POST   | /refresh-token | Public  | Get new access token           |
| GET    | /              | Admin   | Get all users                  |
| GET    | /me            | Private | Get logged-in user profile     |
| PATCH  | /:userId       | Admin   | Update user profile            |
| DELETE | /:userId       | Admin   | Delete a user                  |

#### 1. Register User
**Endpoint**: `POST /otg/api/v1/auth/register`  
**Access**: Admin only  
**Requires JWT**: Yes

**Request**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user",
  "userImage": "file (multipart/form-data)"
}
```

**Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "userImage": "https://cloudinary.com/...",
    "role": "user",
    "createdAt": "2026-05-07T10:00:00Z"
  },
  "message": "User registered successfully",
  "success": true
}
```

#### 2. Login User
**Endpoint**: `POST /otg/api/v1/auth/login`  
**Access**: Public

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "userImage": "https://cloudinary.com/...",
      "role": "user"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_jwt_token"
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### 3. Logout User
**Endpoint**: `POST /otg/api/v1/auth/logout`  
**Access**: Private (requires auth)

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

#### 4. Refresh Access Token
**Endpoint**: `POST /otg/api/v1/auth/refresh-token`  
**Access**: Public

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  },
  "message": "Access token refreshed successfully",
  "success": true
}
```

#### 5. Get All Users
**Endpoint**: `GET /otg/api/v1/auth`  
**Access**: Admin only  
**Requires JWT**: Yes

**Response** (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "user_id_1",
      "name": "John Doe",
      "email": "john@example.com",
      "userImage": "https://cloudinary.com/...",
      "role": "user",
      "createdAt": "2026-05-07T10:00:00Z",
      "updatedAt": "2026-05-07T10:00:00Z"
    },
    {
      "_id": "user_id_2",
      "name": "Admin User",
      "email": "admin@example.com",
      "userImage": "https://cloudinary.com/...",
      "role": "admin",
      "createdAt": "2026-05-06T09:00:00Z",
      "updatedAt": "2026-05-06T09:00:00Z"
    }
  ],
  "message": "Users retrieved successfully",
  "success": true
}
```

**Error Response** (403):
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin access required",
  "success": false
}
```

#### 6. Get Current User
**Endpoint**: `GET /otg/api/v1/auth/me`  
**Access**: Private (requires auth)

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "userImage": "https://cloudinary.com/...",
    "role": "user",
    "createdAt": "2026-05-07T10:00:00Z"
  },
  "message": "User profile retrieved successfully",
  "success": true
}
```

#### 7. Update User Profile
**Endpoint**: `PATCH /otg/api/v1/auth/:userId`  
**Access**: Admin only  
**Requires JWT**: Yes

**Request Parameters**:
- `userId` (path parameter): The ID of the user to update

**Request**:
```json
{
  "name": "John Doe",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "role": "admin",
  "userImage": "file (multipart/form-data, optional)"
}
```

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "newemail@example.com",
    "userImage": "https://cloudinary.com/...",
    "role": "admin",
    "updatedAt": "2026-05-07T10:30:00Z"
  },
  "message": "User updated successfully",
  "success": true
}
```

**Error Response** (403):
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin access required",
  "success": false
}
```

**Error Response** (404):
```json
{
  "statusCode": 404,
  "message": "User not found",
  "success": false
}
```

#### 8. Delete User
**Endpoint**: `DELETE /otg/api/v1/auth/:userId`  
**Access**: Admin only  
**Requires JWT**: Yes

**Request Parameters**:
- `userId` (path parameter): The ID of the user to delete

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User deleted successfully",
  "success": true
}
```

**Error Response** (404):
```json
{
  "statusCode": 404,
  "message": "User not found",
  "success": false
}
```

---

### Services Routes: `/otg/api/v1/services`

| Method | Endpoint | Access | Description           |
|--------|----------|--------|----------------------|
| POST   | /        | Admin  | Create a service      |
| GET    | /        | Public | Get all services      |
| GET    | /:id     | Public | Get single service    |
| PATCH  | /:id     | Admin  | Update a service      |
| DELETE | /:id     | Admin  | Delete a service      |

#### 1. Create Service
**Endpoint**: `POST /otg/api/v1/services`  
**Access**: Admin only

**Request**:
```json
{
  "serviceName": "Student Visa Consultation",
  "shortDescription": "Professional visa consultation services",
  "details": ["Visa assessment", "Document preparation", "Interview coaching"],
  "serviceImage": "file (multipart/form-data)"
}
```

**Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "service_id",
    "serviceName": "Student Visa Consultation",
    "shortDescription": "Professional visa consultation services",
    "serviceImage": "https://res.cloudinary.com/...",
    "details": ["Visa assessment", "Document preparation", "Interview coaching"],
    "createdAt": "2026-05-07T10:00:00Z"
  },
  "message": "Service created successfully",
  "success": true
}
```

#### 2. Get All Services
**Endpoint**: `GET /otg/api/v1/services`  
**Access**: Public

**Response** (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "service_id",
      "serviceName": "Student Visa Consultation",
      "shortDescription": "Professional visa consultation services",
      "serviceImage": "https://res.cloudinary.com/...",
      "details": ["Visa assessment", "Document preparation"],
      "createdAt": "2026-05-07T10:00:00Z"
    }
  ],
  "message": "Retrieved 1 services successfully",
  "success": true
}
```

#### 3. Get Single Service
**Endpoint**: `GET /otg/api/v1/services/:id`  
**Access**: Public

**Response** (200): Same as single service object

#### 4. Update Service
**Endpoint**: `PATCH /otg/api/v1/services/:id`  
**Access**: Admin only

**Request**: Same as create (all fields optional)

#### 5. Delete Service
**Endpoint**: `DELETE /otg/api/v1/services/:id`  
**Access**: Admin only

**Response** (200): Returns deleted service object

---

### Testimonials Routes: `/otg/api/v1/testimonials`

| Method | Endpoint | Access | Description              |
|--------|----------|--------|--------------------------|
| POST   | /        | Admin  | Create a testimonial     |
| GET    | /        | Public | Get all testimonials     |
| PATCH  | /:id     | Admin  | Update a testimonial     |
| DELETE | /:id     | Admin  | Delete a testimonial     |

#### 1. Create Testimonial
**Endpoint**: `POST /otg/api/v1/testimonials`  
**Access**: Admin only

**Request**:
```json
{
  "author": "John Doe",
  "quote": "Excellent service and professional team!",
  "location": "United States",
  "authorImage": "file (multipart/form-data)"
}
```

**Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "testimonial_id",
    "author": "John Doe",
    "quote": "Excellent service and professional team!",
    "location": "United States",
    "authorImage": "https://res.cloudinary.com/...",
    "createdAt": "2026-05-07T10:00:00Z"
  },
  "message": "Testimonial created successfully",
  "success": true
}
```

#### 2. Get All Testimonials
**Endpoint**: `GET /otg/api/v1/testimonials`  
**Access**: Public

**Response** (200): Returns array of testimonials

#### 3. Update Testimonial
**Endpoint**: `PATCH /otg/api/v1/testimonials/:id`  
**Access**: Admin only

**Request**:
```json
{
  "author": "Jane Smith",
  "quote": "Outstanding service and support!",
  "location": "Canada",
  "authorImage": "file (multipart/form-data, optional)"
}
```

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "testimonial_id",
    "author": "Jane Smith",
    "quote": "Outstanding service and support!",
    "location": "Canada",
    "authorImage": "https://res.cloudinary.com/...",
    "updatedAt": "2026-05-07T10:30:00Z"
  },
  "message": "Testimonial updated successfully",
  "success": true
}
```

#### 4. Delete Testimonial
**Endpoint**: `DELETE /otg/api/v1/testimonials/:id`  
**Access**: Admin only

**Response** (200): Returns deleted testimonial object

---

### Inquiries Routes: `/otg/api/v1/inquiries`

| Method | Endpoint | Access | Description        |
|--------|----------|--------|---------------------|
| POST   | /        | Public | Submit an inquiry   |
| GET    | /        | Admin  | Get all inquiries   |
| PATCH  | /:id     | Admin  | Update an inquiry   |
| DELETE | /:id     | Admin  | Delete an inquiry   |

#### 1. Create Inquiry
**Endpoint**: `POST /otg/api/v1/inquiries`  
**Access**: Public

**Request**:
```json
{
  "inquiryEmail": "student@example.com",
  "inquiryPhone": "+1-123-456-7890",
  "inquiryService": "Student Visa Consultation",
  "inquiryCalc": "Eligibility"
}
```

**Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "inquiry_id",
    "inquiryEmail": "student@example.com",
    "inquiryPhone": "+1-123-456-7890",
    "inquiryService": "Student Visa Consultation",
    "inquiryCalc": "Eligibility",
    "createdAt": "2026-05-07T10:00:00Z"
  },
  "message": "Inquiry submitted successfully",
  "success": true
}
```

#### 2. Get All Inquiries
**Endpoint**: `GET /otg/api/v1/inquiries`  
**Access**: Admin only

**Response** (200): Returns array of inquiries

#### 3. Update Inquiry
**Endpoint**: `PATCH /otg/api/v1/inquiries/:id`  
**Access**: Admin only

**Request**:
```json
{
  "inquiryEmail": "newemail@example.com",
  "inquiryPhone": "+1-987-654-3210",
  "inquiryService": "Work Visa Consultation",
  "inquiryCalc": "CGPA"
}
```

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "inquiry_id",
    "inquiryEmail": "newemail@example.com",
    "inquiryPhone": "+1-987-654-3210",
    "inquiryService": "Work Visa Consultation",
    "inquiryCalc": "CGPA",
    "updatedAt": "2026-05-07T10:30:00Z"
  },
  "message": "Inquiry updated successfully",
  "success": true
}
```

#### 4. Delete Inquiry
**Endpoint**: `DELETE /otg/api/v1/inquiries/:id`  
**Access**: Admin only

**Response** (200): Returns deleted inquiry object

---

### Email Routes: `/otg/api/v1/email`

| Method | Endpoint      | Access | Description              |
|--------|---------------|--------|--------------------------|
| POST   | /send         | Admin  | Send custom email        |
| POST   | /reply/:id    | Admin  | Reply to inquiry         |

#### 1. Send Email
**Endpoint**: `POST /otg/api/v1/email/send`  
**Access**: Admin only

**Request**:
```json
{
  "to": "recipient@example.com",
  "subject": "Welcome to OTG Global Mobility",
  "html": "<h1>Welcome!</h1><p>Thank you for choosing our services.</p>"
}
```

**Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "id": "email_id",
    "from": "noreply@otgglobalmobility.com",
    "to": "recipient@example.com",
    "subject": "Welcome to OTG Global Mobility",
    "created_at": "2026-05-07T10:00:00Z"
  },
  "message": "Email sent successfully",
  "success": true
}
```

#### 2. Reply to Inquiry
**Endpoint**: `POST /otg/api/v1/email/reply/:id`  
**Access**: Admin only

**Request**:
```json
{
  "subject": "Re: Your Inquiry",
  "html": "<h1>Thank you for your inquiry</h1><p>We will contact you shortly...</p>"
}
```

**Response** (200): Same as send email response

---

## Cloudinary Folder Structure

Files uploaded to Cloudinary are organized into the following folder structure:

```
OTGGlobalMobility/
  ├── users/               # User profile images
  ├── ServiceImages/       # Service images
  └── testimonials/        # Testimonial author images
```

### Upload Flow

1. **Client sends file** via multipart/form-data
2. **Multer** temporarily saves to `./public/temp`
3. **Cloudinary** uploads to appropriate folder
4. **Local temp file** is automatically deleted (success or failure)
5. **API returns** Cloudinary secure URL

---

## Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "errors": [],
  "success": false
}
```

### Common Error Codes

| Code | Meaning                          |
|------|----------------------------------|
| 400  | Bad Request (validation error)   |
| 401  | Unauthorized (auth failed)       |
| 403  | Forbidden (insufficient access)  |
| 404  | Not Found                        |
| 409  | Conflict (duplicate entry)       |
| 500  | Internal Server Error            |

### Error Examples

**Validation Error**:
```json
{
  "statusCode": 400,
  "message": "Email and password are required",
  "success": false
}
```

**Unauthorized**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized - No token provided",
  "success": false
}
```

**Duplicate Key**:
```json
{
  "statusCode": 409,
  "message": "email already exists",
  "success": false
}
```

---

## Authentication Headers

For protected routes, include the access token in either:

### Option 1: HTTP-only Cookie (Automatic)
The token is automatically sent with requests to the same domain.

### Option 2: Authorization Header
```
Authorization: Bearer <accessToken>
```

---

## Response Format

All successful responses follow this format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

---

## Database Models

### User Schema
```javascript
{
  name: String (optional),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  userImage: String (Cloudinary URL, optional),
  role: String (enum: ['user', 'admin', 'student'], default: 'user'),
  refreshToken: String,
  timestamps: true
}
```

### Service Schema
```javascript
{
  serviceImage: String (required, Cloudinary URL),
  serviceName: String (required, unique),
  details: [String] (default: []),
  shortDescription: String (required),
  timestamps: true
}
```

### Testimonial Schema
```javascript
{
  author: String (required),
  authorImage: String (required, Cloudinary URL),
  quote: String (required),
  location: String (required),
  timestamps: true
}
```

### Inquiry Schema
```javascript
{
  inquiryEmail: String (required),
  inquiryPhone: String (required),
  inquiryService: String (required),
  inquiryCalc: String (enum: ['Eligibility', 'CGPA'], required),
  timestamps: true
}
```

---

## Middleware

### verifyJWT
Verifies the access token and attaches user data to `req.user`. Required for all private routes.

### isAdmin
Checks if the user has the "admin" role. Used for admin-only routes.

---

## Project Structure

```
otg_global_mobility_backend/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── testimonialController.js
│   │   ├── inquiryController.js
│   │   └── emailController.js
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Testimonial.js
│   │   └── Inquiry.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── inquiryRoutes.js
│   │   └── emailRoutes.js
│   ├── middlewares/          # Express middlewares
│   │   └── auth.js
│   ├── config/               # Configuration files
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── multer.js
│   └── utils/                # Utility classes
│       ├── ApiError.js
│       ├── ApiResponse.js
│       └── asyncHandler.js
├── public/
│   └── temp/                 # Temporary file upload folder
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── app.js                    # Express app setup
├── index.js                  # Server entry point
├── package.json              # Dependencies
└── API_DOCS.md               # This file
```

---

## Tips for Development

1. **Always use AsyncHandler** for controllers to avoid try-catch blocks
2. **Throw ApiError** for consistent error responses
3. **Return ApiResponse** for consistent success responses
4. **Never return passwords** - use `.select('-password -refreshToken')`
5. **Handle Multer files** - always clean up temp files after upload
6. **Test with Postman** - use the provided route documentation
7. **Monitor logs** - watch console output for debugging

---

## Support & Troubleshooting

### "Unauthorized - No token provided"
- Ensure you're logged in and have valid cookies
- Check that the access token hasn't expired
- Try refreshing the token with `/refresh-token`

### "Cloudinary upload failed"
- Verify credentials in `.env`
- Check file size (typically max 100MB)
- Ensure file format is supported

### "MongoDB connection failed"
- Verify `MONGODB_URI` in `.env`
- Check network connection
- Ensure MongoDB is running

### CORS errors
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Ensure `credentials: true` is set in frontend requests

---

## License

ISC License - OTG Global Mobility

---

**Last Updated**: May 7, 2026  
**API Version**: 1.0.0
