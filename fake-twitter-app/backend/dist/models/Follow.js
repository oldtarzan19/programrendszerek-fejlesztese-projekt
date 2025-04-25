"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
// src/models/Follow.ts
const mongoose_1 = __importDefault(require("mongoose"));
const FollowSchema = new mongoose_1.default.Schema({
    follower: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.Follow = mongoose_1.default.model('Follow', FollowSchema);
