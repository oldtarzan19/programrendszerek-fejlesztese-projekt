"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed/seed.ts
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Tweet_1 = require("../models/Tweet");
const Comment_1 = require("../models/Comment");
const Follow_1 = require("../models/Follow");
const dbUrl = 'mongodb://localhost:27017/fake_twitter';
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(dbUrl);
        console.log('Connected to MongoDB for seeding.');
        // Töröljük a meglévő kollekciókat
        yield User_1.User.deleteMany({});
        yield Tweet_1.Tweet.deleteMany({});
        yield Comment_1.Comment.deleteMany({});
        yield Follow_1.Follow.deleteMany({});
        // Admin létrehozása
        const admin = new User_1.User({
            email: 'admin@fake-twitter.com',
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });
        yield admin.save();
        // Normál felhasználók létrehozása
        const user1 = new User_1.User({
            email: 'user1@fake-twitter.com',
            username: 'user1',
            password: 'user123'
        });
        const user2 = new User_1.User({
            email: 'user2@fake-twitter.com',
            username: 'user2',
            password: 'user123'
        });
        yield user1.save();
        yield user2.save();
        // Tweetek létrehozása
        const tweet1 = new Tweet_1.Tweet({
            user: user1._id,
            content: 'Hello from user1!'
        });
        const tweet2 = new Tweet_1.Tweet({
            user: user2._id,
            content: 'Hello from user2!'
        });
        yield tweet1.save();
        yield tweet2.save();
        // Kommentek létrehozása
        const comment1 = new Comment_1.Comment({
            user: user2._id,
            tweet: tweet1._id,
            content: 'Nice tweet, user1!'
        });
        const comment2 = new Comment_1.Comment({
            user: user1._id,
            tweet: tweet2._id,
            content: 'Thank you, user2!'
        });
        yield comment1.save();
        yield comment2.save();
        // Követési kapcsolatok létrehozása
        const follow1 = new Follow_1.Follow({
            follower: user1._id,
            following: user2._id
        });
        const follow2 = new Follow_1.Follow({
            follower: user2._id,
            following: admin._id
        });
        yield follow1.save();
        yield follow2.save();
        console.log('Seeding completed.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database: ', error);
        process.exit(1);
    }
});
seedDatabase();
