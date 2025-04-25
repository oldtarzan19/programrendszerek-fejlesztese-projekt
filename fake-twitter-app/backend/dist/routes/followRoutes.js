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
// src/routes/followRoutes.ts
const express_1 = require("express");
const Follow_1 = require("../models/Follow");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
// Követési kapcsolat létrehozása
router.post('/', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { following } = req.body;
        const follow = new Follow_1.Follow({
            follower: req.user._id,
            following,
        });
        yield follow.save();
        res.status(201).json(follow);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Egy felhasználó követőinek lekérése
router.get('/:userId/followers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followers = yield Follow_1.Follow.find({ following: req.params.userId }).populate('follower', 'username email');
        res.status(200).json(followers);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Egy felhasználó által követett felhasználók lekérése
router.get('/:userId/following', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const following = yield Follow_1.Follow.find({ follower: req.params.userId }).populate('following', 'username email');
        res.status(200).json(following);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Követési kapcsolat megszüntetése
router.delete('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Follow_1.Follow.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Unfollowed successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
