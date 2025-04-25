"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passportConfig_1 = require("./passport/passportConfig");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const dbUrl = 'mongodb://localhost:27017/fake_twitter';
// MongoDB kapcsolat
mongoose_1.default.connect(dbUrl)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(error => console.error('MongoDB connection error: ', error));
// Middleware-ek
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));
// Passport beállítása
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passportConfig_1.configurePassport)(passport_1.default);
// Alapértelmezett útvonal a gyökér URL-re
app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
});
// API végpontok
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/tweets', tweetRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/follows', followRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
