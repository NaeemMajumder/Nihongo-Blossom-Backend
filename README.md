# Nihongo Blossom - Japanese Vocabulary Learning Application

## Project Overview
**Nihongo Blossom** is a comprehensive web application designed to assist users in learning Japanese vocabulary in an engaging and structured way. Built using the MERN stack, this platform allows students to track their progress through lessons, explore tutorials, and enjoy a personalized learning experience.

---

## Live Links
- **Frontend**: [Nihongo Blossom Frontend](https://programminghero-job.web.app/login)
- **Backend**: [Nihongo Blossom Backend](https://programminghero-job-ta-backend.vercel.app/)

---

## Key Features
- **User Authentication**: Users can log in using email/password or Google authentication (via Firebase).
- **Lesson Tracking**: Each user's lesson completion progress is tracked individually, ensuring personalized progress data.
- **Tutorials Section**: Embedded YouTube tutorials to provide additional resources for learning Japanese.
- **Admin Features**: Admins can manage lessons, tutorials, and user data seamlessly.
- **Responsive Design**: Tailored for both desktop and mobile experiences, using Tailwind CSS.

---

## Technologies Used
### Frontend:
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Authentication**: Firebase

### Backend:
- **Framework**: Express.js
- **Database**: MongoDB (local during development and MongoDB Atlas in production)
- **ODM**: Mongoose
- **Authentication**: Firebase
- **Environment Variables**: `.env` for secure configuration

---

## Challenges Faced
### 1. **Deployment Issues**
- Configuring Firebase hosting for the frontend.
- Deploying the backend on Vercel with the correct configurations for MongoDB Atlas.

### 2. **CORS Errors**
- Resolved CORS issues by properly configuring middleware in the backend to allow communication between frontend and backend hosted on different domains.

### 3. **Tracking Individual Progress**
- Designed schemas to track lesson completion uniquely for each user without affecting others.
- Utilized references between `User` and `Lesson` schemas effectively.

### 4. **Data Fetching**
- Encountered challenges fetching and rendering data for lessons and tutorials. Optimized API responses to ensure smoother data flow and user experience.

---

## Installation and Setup (Local Development)
### Prerequisites
- Node.js
- MongoDB (Local or Atlas)

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <frontend-repo-link>
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <backend-repo-link>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```env
   PORT=8080
   MONGODB_URI=<your-mongodb-connection-string>
   ```
4. Run the development server:
   ```bash
   node index.js
   ```

---

## Usage
1. Visit the [Frontend Link](https://programminghero-job.web.app/login) to access the application.
2. Log in using email/password or Google authentication.
3. Navigate through lessons and tutorials to start learning.
4. Admins can access the admin panel to manage users and lessons.

---

## Future Enhancements
- **Interactive Quizzes**: Add quizzes for each lesson to make learning more interactive.
- **Progress Insights**: Provide detailed analytics and insights into users' learning progress.
- **Mobile App**: Develop a companion mobile application for better accessibility.

---

## Contribution
Feel free to fork the repository and contribute. Open issues or feature requests are always welcome.

---

## License
This project is licensed under the MIT License.
