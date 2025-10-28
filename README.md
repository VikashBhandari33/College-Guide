# College Guide - Full Stack Application

A comprehensive college management system with timetables, syllabus, events, and personal todo management.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Timetable Management**: View class schedules for different departments (ECE, CSE, DSAI)
- **Course Syllabus**: Access course materials and professor information
- **Events & Holidays**: View upcoming academic events and holiday calendar
- **Exam Schedule**: Track exam dates and important academic deadlines
- **Personal Todo List**: Manage personal tasks with database persistence

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS for styling
- AOS (Animate On Scroll) for animations
- Feather Icons for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://vikashbhandari367:5Vikash~12@collegeguide.kj0brla.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=https://college-guide-frontend.onrender.com
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Update the `MONGODB_URI` in `.env`

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `https://college-guide-frontend.onrender.com`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Todos
- `GET /api/todos` - Get all todos for current user
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Todo Model
```javascript
{
  title: String (required),
  description: String,
  completed: Boolean (default: false),
  dueDate: Date,
  priority: String (enum: ['low', 'medium', 'high']),
  user: ObjectId (ref: 'User'),
  createdAt: Date
}
```

## Project Structure

```
college-guide/
├── public/                 # Static files served by Express
│   ├── index.html         # Main HTML file
│   ├── style.css          # Custom CSS styles
│   └── script.js          # Frontend JavaScript
├── models/                # MongoDB models
│   ├── User.js           # User schema
│   └── Todo.js           # Todo schema
├── routes/                # API routes
│   ├── auth.js           # Authentication routes
│   └── todos.js          # Todo routes
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## Usage

1. **Register/Login**: Create an account or login to access todo features
2. **View Timetables**: Switch between different department schedules
3. **Access Syllabus**: Click on syllabus links to view course materials
4. **Manage Todos**: Add, edit, and delete personal tasks
5. **Track Events**: View upcoming academic events and holidays

## Development

### Adding New Features
1. Create new routes in the `routes/` directory
2. Add corresponding models in the `models/` directory
3. Update frontend JavaScript in `public/script.js`
4. Add new API endpoints to the documentation

### Database Operations
- All user data is stored in MongoDB
- Todos are linked to users via ObjectId references
- Passwords are automatically hashed using bcryptjs

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS configuration for secure cross-origin requests
- Input validation using express-validator
- Error handling middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
