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
exports.configurePassport = void 0;
const passport_local_1 = require("passport-local");
const User_1 = require("../models/User");
const configurePassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findById(id);
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
    passport.use(new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // A findOne callback helyett async/await-et használunk
            const user = yield User_1.User.findOne({ email }); // Így már Promise-alapú
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            // comparePassword maradhat callback-es, ha a modelben úgy definiáltad
            user.comparePassword(password, (err, isMatch) => {
                if (err)
                    return done(err);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
        catch (error) {
            return done(error);
        }
    })));
};
exports.configurePassport = configurePassport;
