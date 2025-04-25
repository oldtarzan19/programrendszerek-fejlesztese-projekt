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
// src/routes/userRoutes.ts
const express_1 = require("express");
const User_1 = require("../models/User");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
// Összes felhasználó lekérése (csak admin)
router.get('/', authMiddleware_1.isAuthenticated, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({});
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Egy felhasználó lekérése (saját vagy admin)
router.get('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        const user = yield User_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Felhasználó felfüggesztése (admin)
router.patch('/:id/suspend', authMiddleware_1.isAuthenticated, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json({ message: 'User suspended', user });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Felhasználó adatainak frissítése (saját)
router.patch('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user._id.toString() !== req.params.id) {
            res.status(403).send('Forbidden');
            return;
        }
        const updates = req.body;
        const user = yield User_1.User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Felhasználó törlése (saját vagy admin)
router.delete('/:id', authMiddleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        const user = yield User_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
