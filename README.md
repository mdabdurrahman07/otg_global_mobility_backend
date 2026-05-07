# OTG Global Mobility Backend

A comprehensive REST API backend for OTG Global Mobility, built with Node.js, Express.js, and MongoDB.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Copy the template below and create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
RESEND_API_KEY=your_resend_api_key
CORS_ORIGIN=http://localhost:3000
```

### 3. Run the Server
```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000`

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **File Storage**: Cloudinary
- **Email Service**: Resend
- **File Upload**: Multer

## Key Features

✅ **JWT Authentication** with HTTP-only cookies  
✅ **Role-based Access Control** (Admin & User)  
✅ **File Upload to Cloudinary** with automatic cleanup  
✅ **Email Notifications** via Resend  
✅ **MongoDB Integration** with Mongoose  
✅ **Global Error Handling** with custom error classes  
✅ **Async Request Handler** (no try-catch in controllers)  
✅ **Comprehensive API Documentation**  

## Project Structure

```
src/
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── middlewares/    # Auth & custom middleware
├── utils/          # Helper classes
└── config/         # Database, Cloudinary, Multer
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user (Admin)
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `GET /me` - Get user profile

### Services (`/api/v1/services`)
- `POST /` - Create service (Admin)
- `GET /` - Get all services
- `GET /:id` - Get single service
- `PATCH /:id` - Update service (Admin)
- `DELETE /:id` - Delete service (Admin)

### Testimonials (`/api/v1/testimonials`)
- `POST /` - Create testimonial (Admin)
- `GET /` - Get all testimonials
- `DELETE /:id` - Delete testimonial (Admin)

### Inquiries (`/api/v1/inquiries`)
- `POST /` - Submit inquiry (Public)
- `GET /` - Get all inquiries (Admin)
- `DELETE /:id` - Delete inquiry (Admin)

### Email (`/api/v1/email`)
- `POST /send` - Send custom email (Admin)
- `POST /reply/:id` - Reply to inquiry (Admin)

## Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `ACCESS_TOKEN_SECRET` | Secret for access token signing |
| `REFRESH_TOKEN_SECRET` | Secret for refresh token signing |
| `RESEND_API_KEY` | Resend email service API key |
| `CORS_ORIGIN` | Frontend URL for CORS |

## Authentication Flow

1. **User Registration** (Admin creates users)
   - POST `/api/v1/auth/register` with email, password, image

2. **User Login**
   - POST `/api/v1/auth/login` → receive access & refresh tokens in cookies

3. **Protected Requests**
   - Include `accessToken` cookie automatically
   - Or use `Authorization: Bearer <token>` header

4. **Token Refresh**
   - POST `/api/v1/auth/refresh-token` → get new access token
   - Uses refresh token from cookie

5. **Logout**
   - POST `/api/v1/auth/logout` → clears cookies and DB token

## File Upload Flow

1. **Client uploads file** via multipart/form-data
2. **Multer stores** file temporarily in `./public/temp`
3. **Cloudinary uploads** to appropriate folder
4. **Temp file is deleted** (success or failure)
5. **API returns** Cloudinary secure URL

### Cloudinary Folder Structure
```
OTGGlobalMobility/
├── users/           # User profile images
├── ServiceImages/   # Service images
└── testimonials/    # Testimonial author images
```

## Error Handling

All errors return consistent format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "errors": [],
  "success": false
}
```

## Utility Classes

### ApiError
Custom error class for consistent error responses:
```javascript
throw new ApiError(statusCode, message, errors);
```

### ApiResponse
Standard success response wrapper:
```javascript
return res.json(new ApiResponse(statusCode, data, message));
```

### asyncHandler
Higher-order function for error catching:
```javascript
const controller = asyncHandler(async (req, res) => {
  // No need for try-catch!
});
```

## Database Models

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  userImage: String,
  role: String (enum: ['user', 'admin']),
  refreshToken: String,
  timestamps: true
}
```

### Service
```javascript
{
  serviceName: String (unique),
  serviceImage: String,
  shortDescription: String,
  details: [String],
  timestamps: true
}
```

### Testimonial
```javascript
{
  author: String,
  authorImage: String,
  quote: String,
  location: String,
  timestamps: true
}
```

### Inquiry
```javascript
{
  inquiryEmail: String,
  inquiryPhone: String,
  inquiryService: String,
  inquiryCalc: String (enum: ['Eligibility', 'CGPA']),
  timestamps: true
}
```

## Middleware

### verifyJWT
- Extracts and verifies access token
- Attaches `req.user` to request
- Required for private routes

### isAdmin
- Checks if user role is "admin"
- Returns 403 Forbidden if not admin

## Security Features

✅ **Password Hashing** with bcryptjs  
✅ **HTTP-only Cookies** for token storage  
✅ **CORS Configuration** for security  
✅ **JWT Expiration** for token safety  
✅ **Refresh Token Rotation** in database  
✅ **Environment Variables** for secrets  

## Development Tips

1. **Test Routes** with Postman using the API_DOCS.md
2. **Check Logs** for debugging - console shows clear error messages
3. **No Try-Catch** needed in controllers - asyncHandler handles it
4. **Always Throw ApiError** for error consistency
5. **Always Return ApiResponse** for success consistency
6. **Passwords Never Returned** in responses - use `.select('-password')`

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or:
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
- Check MONGODB_URI format
- Ensure MongoDB is running
- Verify network access

### Cloudinary Upload Failed
- Verify API credentials
- Check file size and format
- Review Cloudinary account settings

## Documentation

See [API_DOCS.md](./API_DOCS.md) for detailed API documentation with examples.

## Scripts

```bash
npm start          # Run production server
npm run dev        # Run development server with auto-reload
npm test           # Run tests (if configured)
```

## License

ISC License - OTG Global Mobility

## Support

For issues or questions, refer to [API_DOCS.md](./API_DOCS.md) or check the `/api/v1` health check endpoint.
