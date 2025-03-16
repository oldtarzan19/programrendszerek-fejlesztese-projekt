// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passportConfig';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import commentRoutes from './routes/commentRoutes';
import followRoutes from './routes/followRoutes';

const app = express();
const port = process.env.PORT || 5000;
const dbUrl = 'mongodb://localhost:27017/fake_twitter';

// MongoDB kapcsolat
mongoose.connect(dbUrl)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(error => console.error('MongoDB connection error: ', error));

// Middleware-ek
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Passport beállítása
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Alapértelmezett útvonal a gyökér URL-re
app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
});

// API végpontok
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
