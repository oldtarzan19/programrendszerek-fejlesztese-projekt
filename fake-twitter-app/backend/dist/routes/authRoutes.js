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
// src/routes/authRoutes.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Regisztráció
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const newUser = new User_1.User({ email, username, password });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Bejelentkezés
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(400).json({ message: (info === null || info === void 0 ? void 0 : info.message) || 'Login failed' });
        req.logIn(user, err => {
            if (err)
                return next(err);
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});
// Kijelentkezés
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err)
            return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});
exports.default = router;
