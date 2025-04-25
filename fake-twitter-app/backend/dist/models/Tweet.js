"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
// src/models/Tweet.ts
const mongoose_1 = __importDefault(require("mongoose"));
const TweetSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    retweetOf: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tweet', default: null }
});
exports.Tweet = mongoose_1.default.model('Tweet', TweetSchema);
