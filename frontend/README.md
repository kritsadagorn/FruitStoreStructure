# Fruit Store Frontend

React.js frontend application for Somjai Fresh Fruit Store. A modern, responsive e-commerce interface for browsing and managing fruit products.

## 🚀 Features

- **Modern UI**: Clean, responsive design with mobile support
- **Product Catalog**: Browse fruits with search and filter capabilities
- **Admin Dashboard**: Complete product and category management
- **Image Gallery**: Product image carousel and modal views
- **Authentication**: Secure login system with protected routes
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.7.0
- **HTTP Client**: Axios 1.10.0
- **UI Components**: Lucide React icons
- **Carousel**: React Slick & React Responsive Carousel

## 📁 Project Structure
frontend/
├── public/
│   ├── banner.png         # Hero banner image
│   ├── logoFruit.jpg      # Company logo
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable React components
│   │   ├── CategoryManager.js
│   │   ├── ImageModal.js
│   │   ├── ProductCard.js
│   │   ├── ProductList.js
│   │   ├── ProductManager.js
│   │   ├── ProtectedRoute.js
│   │   ├── RecommendedProductsCarousel.js
│   │   └── SearchFilter.js
│   ├── pages/             # Page components
│   │   ├── AdminDashboard.js
│   │   ├── HomePage.js
│   │   └── LoginPage.js
│   ├── services/          # API service functions
│   ├── App.js             # Main application component
│   ├── App.css            # Global styles
│   ├── index.js           # Application entry point
│   └── index.css          # Base styles
└── package.json           # Dependencies and scripts



## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at http://localhost:3000

## 📱 Application Pages

### Home Page (`/`)
- Product catalog with search and filtering
- Recommended products carousel
- Category-based product browsing
- Responsive product grid layout

### Admin Dashboard (`/admindashboard`)
- Protected route requiring authentication
- Product management (CRUD operations)
- Category management
- Image upload functionality

### Login Page (`/login`)
- Secure authentication form
- JWT token management
- Redirect to dashboard after login

## 🧩 Key Components

### ProductCard
- Individual product display component
- Image carousel for multiple product images
- Price and weight information
- Category and recommendation badges

### ProductManager
- Admin component for product CRUD operations
- Image upload with preview
- Form validation and error handling
- Real-time updates

### CategoryManager
- Category creation and management
- Integration with product categorization

### SearchFilter
- Advanced product search functionality
- Category-based filtering
- Price range filtering
- Real-time search results

### RecommendedProductsCarousel
- Featured products display
- Responsive carousel implementation
- Auto-play and navigation controls

### ProtectedRoute
- Authentication wrapper component
- Redirects unauthorized users
- JWT token validation

## 🎨 Styling

- **CSS Modules**: Component-specific styling
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional appearance
- **Accessibility**: ARIA labels and semantic HTML

## 📱 Responsive Features

- Mobile-optimized navigation
- Responsive product grid
- Touch-friendly carousel controls
- Adaptive image sizing
- Mobile-first CSS design

## 🔒 Authentication Flow

1. User navigates to `/login`
2. Submits credentials via login form
3. JWT token stored in localStorage
4. Protected routes check token validity
5. Admin dashboard accessible after authentication

## 🌐 API Integration

The frontend communicates with the backend API for:
- Product data retrieval and management
- Category operations
- User authentication
- Image upload and storage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🏗️ Build & Deployment

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

### Deployment Platforms
- **Custom Domain**: dev.somjaifreshfruit.com
- **Environment**: Production builds optimized for performance

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)