# 📋 Task Manager

A full-stack **MERN Task Management Application** that helps users organize, manage, and track their daily tasks efficiently. The application features secure authentication, task management capabilities, and a responsive user interface for a seamless productivity experience.

## 🚀 Features

* 🔐 User Authentication (JWT)
* 👤 User Registration & Login
* ✅ Create, Read, Update, and Delete (CRUD) Tasks
* 📌 Mark tasks as completed or pending
* 📱 Responsive UI for desktop and mobile
* 🔒 Protected Routes
* ⚡ Fast and intuitive user experience

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JSON Web Token (JWT)

## 📂 Project Structure

```
Task-Manager/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── models/          # MongoDB Models
├── routes/          # API Routes
├── middleware/      # Authentication Middleware
├── controllers/     # Business Logic
└── README.md
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/task-manager.git
```

### Navigate to the project

```bash
cd task-manager
```

### Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### Configure Environment Variables

Create a `.env` file in the server directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start the application

Backend

```bash
npm start
```

Frontend

```bash
npm start
```

The application will be available at:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

## 📸 Screenshots

Add screenshots of your application here.

```
screenshots/
├── login.png
├── dashboard.png
└── tasks.png
```

## 🎯 Future Improvements

* Task categories
* Task priority levels
* Due date reminders
* Search and filtering
* Dark mode
* Drag-and-drop task organization
* Email notifications

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project helpful, consider giving it a star!
