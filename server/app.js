const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const dbconfig = require('./config/db.config')
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const initializePassport = require('./service/passport');
const User = require('./models/User.model');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.route');
const drawingRoute = require('./routes/drawings.route');
const userRoute = require('./routes/users.route');
const wssHandler = require('./sockets/sockets');

// Read environmental variables
dotenv.config();

// Initialize application instance
const app = express();
const server = http.createServer(app);

dbconfig.connect().then(() => {
    console.log('Successfully connected to the database');
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

// Parse cookies and enable CORS support
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  cors({
    origin: ['http://localhost:3001'],
    credentials: true,
  })
);

// Enable JSON body parser and view engine
app.use(express.json());

// Integrate Passport.js
initializePassport(passport);
app.use(passport.initialize());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(flash());

// Mount routes
app.use('/api/users', userRoute);
app.use('/api/drawings', drawingRoute);
app.use('/api/auth', authRoute);

// Serialize and deserialize user objects
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

// Integrate WebSocket
wssHandler(server);

// Start listening for connections
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('Database connected!'));