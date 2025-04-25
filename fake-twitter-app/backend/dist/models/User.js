"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_FACTOR = 10;
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isSuspended: { type: Boolean, default: false }
});
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt_1.default.genSalt(SALT_FACTOR, (err, salt) => {
        if (err)
            return next(err);
        bcrypt_1.default.hash(this.password, salt, (err, hash) => {
            if (err)
                return next(err);
            this.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err)
            return callback(err, false);
        callback(null, isMatch);
    });
};
exports.User = mongoose_1.default.model('User', UserSchema);
