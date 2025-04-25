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
// src/routes/commentRoutes.ts
const express_1 = require("express");
const Comment_1 = require("../models/Comment");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
// Egy tweethez tartozó kommentek lekérése
router.get('/tweet/:tweetId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.Comment.find({ tweet: req.params.tweetId }).populate('user', 'username email');
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Új komment létrehozása (bejelentkezett user)
router.post('/', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweet, content } = req.body;
        const comment = new Comment_1.Comment({
            user: req.user._id,
            tweet,
            content,
        });
        yield comment.save();
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Komment módosítása (csak tulajdonos vagy admin)
router.patch('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }
        if (req.user._id.toString() !== comment.user.toString() && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        comment.content = req.body.content || comment.content;
        yield comment.save();
        res.status(200).json(comment);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Komment törlése (csak tulajdonos vagy admin)
router.delete('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }
        if (req.user._id.toString() !== comment.user.toString() && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        yield Comment_1.Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
