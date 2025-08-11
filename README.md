# Somjai Fresh Fruit Store

A modern e-commerce web application for selling fresh fruits online. This full-stack application features a React frontend with an Express.js backend, MongoDB database, and cloud storage integration.

## 🚀 Features

- **Product Management**: Browse and manage fruit products with categories
- **Admin Dashboard**: Complete admin interface for product and category management
- **Image Upload**: Cloud storage integration (Backblaze B2)
- **Authentication**: Secure login system with JWT tokens
- **Responsive Design**: Mobile-friendly user interface
- **Search & Filter**: Advanced product search and filtering capabilities
- **Recommended Products**: Carousel display of featured products

## 🏗️ Project Structure
fruitStore/
├── backend/          # Node.js Express API server
├── frontend/         # React.js client application
└── README.md         # This file


## 🛠️ Tech Stack

### Frontend
- React 19.1.0
- React Router DOM
- Axios for API calls
- Lucide React for icons
- React Slick for carousels
- Socket.io Client

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary & AWS S3 for image storage
- Socket.io for real-time features
- Multer for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (for image storage)
- AWS S3 bucket (optional, for additional storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fruitStore

1. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```
3. **Environment Configuration**
   - Create a `.env` file in the backend directory
   - Add your Cloudinary and AWS S3 credentials
   - Set other environment variables as needed

