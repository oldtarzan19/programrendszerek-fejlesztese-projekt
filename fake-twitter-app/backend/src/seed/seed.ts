// src/seed/seed.ts
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Tweet } from '../models/Tweet';
import { Comment } from '../models/Comment';
import { Follow } from '../models/Follow';

const dbUrl = 'mongodb://localhost:27017/fake_twitter';

const seedDatabase = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB for seeding.');

        // Töröljük a meglévő kollekciókat
        await User.deleteMany({});
        await Tweet.deleteMany({});
        await Comment.deleteMany({});
        await Follow.deleteMany({});

        // Admin létrehozása
        const admin = new User({
            email: 'admin@fake-twitter.com',
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();

        // Normál felhasználók létrehozása
        const user1 = new User({
            email: 'user1@fake-twitter.com',
            username: 'user1',
            password: 'user123'
        });
        const user2 = new User({
            email: 'user2@fake-twitter.com',
            username: 'user2',
            password: 'user123'
        });
        await user1.save();
        await user2.save();

        // Tweetek létrehozása
        const tweet1 = new Tweet({
            user: user1._id,
            content: 'Hello from user1!'
        });
        const tweet2 = new Tweet({
            user: user2._id,
            content: 'Hello from user2!'
        });
        await tweet1.save();
        await tweet2.save();

        // Kommentek létrehozása
        const comment1 = new Comment({
            user: user2._id,
            tweet: tweet1._id,
            content: 'Nice tweet, user1!'
        });
        const comment2 = new Comment({
            user: user1._id,
            tweet: tweet2._id,
            content: 'Thank you, user2!'
        });
        await comment1.save();
        await comment2.save();

        // Követési kapcsolatok létrehozása
        const follow1 = new Follow({
            follower: user1._id,
            following: user2._id
        });
        const follow2 = new Follow({
            follower: user2._id,
            following: admin._id
        });
        await follow1.save();
        await follow2.save();

        console.log('Seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database: ', error);
        process.exit(1);
    }
};

seedDatabase();
