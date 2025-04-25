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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tweetRoutes.ts
const express_1 = require("express");
const Tweet_1 = require("../models/Tweet");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
// Összes tweet lekérése
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield Tweet_1.Tweet.find({}).populate('user', 'username email');
        res.status(200).json(tweets);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Egy tweet lekérése
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield Tweet_1.Tweet.findById(req.params.id).populate('user', 'username email');
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        res.status(200).json(tweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Új tweet létrehozása (csak bejelentkezett)
router.post('/', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const tweet = new Tweet_1.Tweet({
            user: req.user._id,
            content,
        });
        yield tweet.save();
        res.status(201).json(tweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Tweet módosítása (csak tulajdonos vagy admin)
router.patch('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield Tweet_1.Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if (req.user._id.toString() !== tweet.user.toString() && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        tweet.content = req.body.content || tweet.content;
        yield tweet.save();
        res.status(200).json(tweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Tweet törlése (csak tulajdonos vagy admin)
router.delete('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield Tweet_1.Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if (req.user._id.toString() !== tweet.user.toString() && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        yield Tweet_1.Tweet.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tweet deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Tweet like művelet
router.post('/:id/like', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield Tweet_1.Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if (!tweet.likes.includes(req.user._id)) {
            tweet.likes.push(req.user._id);
            yield tweet.save();
        }
        res.status(200).json(tweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Tweet unlike művelet
router.post('/:id/unlike', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield Tweet_1.Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        tweet.likes = tweet.likes.filter(id => id.toString() !== req.user._id.toString());
        yield tweet.save();
        res.status(200).json(tweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Retweet létrehozása
router.post('/:id/retweet', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const originalTweet = yield Tweet_1.Tweet.findById(req.params.id);
        if (!originalTweet) {
            res.status(404).send('Original Tweet not found');
            return;
        }
        const retweet = new Tweet_1.Tweet({
            user: req.user._id,
            content: originalTweet.content,
            retweetOf: originalTweet._id,
        });
        yield retweet.save();
        res.status(201).json(retweet);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
