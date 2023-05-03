# Koplin

![koplin readme](https://user-images.githubusercontent.com/88671390/235578789-15bcb791-56a9-4c7a-bccf-662f139cbbe4.png)

Koplin is a kanban application built using React, Nodejs, Expressjs, and Postgres. The application allows users to create and manage topics, boards, and tasks, as well as invite friends and collaborate on projects.

## Features
- Users can create an account and log in to manage their own topics and boards
- Create and manage topics and boards
- Create and manage tasks within boards
- Assign tasks to team members
- Edit tasks and move them between different stages (todo, in progress, review, completed)
- Invite friends and collaborate on projects
- Edit profile information including username, email, and profile image

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- react-beautiful-dnd
- axios
- primereact
- quill

### Backend
- Node.js and Express.js for building the backend API
- Sequelize for database management
- JWT for user authentication and authorization
- bcrypt for password hashing and authentication
- SendGrid and Nodemailer for sending email notifications
- Cloudinary and Sharp for image management
- Multer for handling file uploads
- Canvas for generating and manipulating images in Node.js
- Cors for enabling Cross-Origin Resource Sharing (CORS)

### Installation
To get started with Koplin, follow these steps:

1. Clone the repository: `git clone https://github.com/moaazelsayed1/Koplin`
2. Install dependencies:
    - For the frontend, navigate to the client folder and run `npm install`
    - For the backend, navigate to the `server` folder and run `npm install`
3. Install dependencies:
    - For the frontend, navigate to the client folder and run `npm run dev`
    - For the backend, navigate to the `server` folder and run `npm run start:dev`

## Contributors
- Moaaz Elsayed: [GitHub](https://github.com/moaazelsayed1) (BackEnd)
- Hazem Mahdy: [GitHub](https://github.com/Hazemmahdyx) (FrontEnd)
