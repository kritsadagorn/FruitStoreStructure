
## Backend README.md
# Fruit Store Backend API

Express.js REST API server for the Somjai Fresh Fruit Store application. Provides authentication, product management, and file upload capabilities.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for products and categories
- **Authentication**: JWT-based user authentication with sessions
- **File Upload**: Multi-cloud storage support (Cloudinary & AWS S3)
- **Database**: MongoDB integration with Mongoose ODM
- **CORS**: Configured for multiple frontend origins
- **Real-time**: Socket.io support for live updates

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.4
- **Authentication**: JWT + bcryptjs
- **File Storage**: Cloudinary, AWS S3
- **File Upload**: Multer with cloud storage adapters
- **Real-time**: Socket.io 4.8.1
- **Security**: CORS, express-session

## 📁 Project Structure
backend/
├── config/
│   ├── b2.js              # AWS S3 configuration
│   └── cloudinary.js      # Cloudinary configuration
├── models/
│   ├── Category.js        # Category data model
│   └── Product.js         # Product data model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── categories.js     # Category CRUD routes
│   └── products.js       # Product CRUD routes
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables (create this)

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/fruitstore
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   
   # Server Configuration
   PORT=5000
   ```

3. **Start the Server**
   ```bash
   # Development
   npm start
   
   # The server will run on http://localhost:5000
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/recommended` - Get recommended products

## 🗄️ Data Models

### Product Schema
```javascript
{
  name: String (required, unique),
  images: [String] (required),
  category: ObjectId (ref: Category, required),
  price: Number (required),
  weight: Number (required),
  priceType: String (enum: ['per_kg', 'per_piece', 'per_pack']),
  recommended: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

### Category Schema
```javascript
{
  name: String (required, unique),
  description: String,
  createdAt: Date (default: Date.now)
}
```

## 🔒 Security Features

- **CORS**: Configured for specific allowed origins
- **Sessions**: Secure session management with httpOnly cookies
- **JWT**: Token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Environment Variables**: Sensitive data stored in .env

## 🌐 Deployment

Configured for deployment on Railway with the following allowed origins:
- http://localhost:3000 (development)
- https://fruitstorebyohm.vercel.app (production)
- https://dev.somjaifreshfruit.com (custom domain)

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Start the production server
- `npm test` - Run tests (to be implemented)

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Update API documentation for new endpoints
4. Test all changes thoroughly