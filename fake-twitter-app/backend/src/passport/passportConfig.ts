// src/passport/passportConfig.ts
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';

export const configurePassport = (passport: PassportStatic): void => {
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id: string, done) => {
        User.findById(id, (err: any, user: IUser) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email }, (err: Error | null, user: IUser) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
                return done(null, user);
            });
        });
    }));
};
