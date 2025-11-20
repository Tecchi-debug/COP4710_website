# COP4710 Website - React + PHP Architecture

This project uses React for the frontend and PHP for the backend API.

## Project Structure

```
COP4710_website/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── services/           # API service functions
│   │   └── App.js             # Main App component
│   └── package.json
│
├── backend/                    # PHP API
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── restaurants/       # Restaurant CRUD endpoints
│   │   └── config/            # Configuration files
│   ├── models/                # PHP model classes
│   └── utils/                 # Utility functions
│
└── database/                  # Database files
    ├── db.sql                # Database schema
    └── migrations/           # Database migrations
```

## Setup Instructions

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Start XAMPP services:**
   - Start Apache and MySQL

2. **Setup Database:**
   - Create a new database named `wnk_db`
   - Import `database/db.sql` into phpMyAdmin
   - Import `database/test_data.sql` into phpMyAdmin after to get test data
   - Update database credentials in `backend/api/config/database.php`

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers:**

   **Frontend (React):**
   ```bash
   cd frontend
   npm start
   ```
   - React app will run on http://localhost:3000

   **Backend (PHP):**
   - Make sure XAMPP Apache is running
   - PHP API will be accessible at http://localhost/COP4710_website/backend/api

## API Endpoints

### Authentication
- `POST /backend/api/auth/login.php` - User login
- `POST /backend/api/auth/register.php` - User registration
- `POST /backend/api/auth/logout.php` - User logout

### Restaurants
- `GET /backend/api/restaurants/index.php` - Get all restaurants
- `POST /backend/api/restaurants/create.php` - Create restaurant
- `PUT /backend/api/restaurants/update.php?id={id}` - Update restaurant
- `DELETE /backend/api/restaurants/delete.php?id={id}` - Delete restaurant
