# WanderSphere – Rental Booking Platform

A full-stack rental booking web application where users can explore listings, create bookings, upload property images, and leave reviews.

# 🚀 Features
User Authentication & Authorization
Create, Edit & Delete Listings
Review & Rating System
RESTful APIs
MVC Architecture
Interactive Maps with Mapbox
Image Upload using Cloudinary
Centralized Error Handling

# 🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript, EJS, Bootstrap
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Tools & Services: Passport.js, Cloudinary, Mapbox, Render

# 📂Project Structure
```
WANDERSPHERE
│
├── controllers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── init
│   ├── data.js
│   └── index.js
│
├── models
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public
│   ├── css
│   │   ├── rating.css
│   │   └── style.css
│   │
│   └── js
│       ├── map.js
│       └── script.js
│
├── routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── utils
│   ├── expressError.js
│   └── wrapAsync.js
│
├── views
│   ├── includes
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── layouts
│   │   └── boilerplate.ejs
│   │
│   ├── listings
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   │
│   ├── users
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   └── error.ejs
│
├── .env
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
└── README.md
```

# 🔐 Authentication & Authorization
Implemented using Passport.js
Secure login/signup functionality
Protected routes for authorized users only
Ownership checks for listings and reviews

# ☁️ Cloudinary Integration
Used Cloudinary for image uploads and storage
Optimized media delivery for listing images

# 🗺️ Mapbox Integration
Integrated Mapbox for interactive maps
Used Mapbox Geocoding API to convert location names into coordinates
Displayed listing locations dynamically on maps

# 🚨 Error Handling
Centralized error handling middleware
Custom ExpressError utility
Async error handling using wrapAsync

# 🚀 Deployment
Deployed on Render

# 📚 Future Improvements
Wishlist/Favorites Feature
Payment Gateway Integration
Advanced Search & Filters
Real-time Booking Availability
Improved Mobile Responsiveness
Integrating OpenAI API for smart property recommendations, AI-powered travel assistance, automated review summarization, and chatbot-based user support
