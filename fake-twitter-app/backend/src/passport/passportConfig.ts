import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';

export const configurePassport = (passport: PassportStatic): void => {
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });

    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email: string, password: string, done) => {
            try {

                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                user.comparePassword(password, (err, isMatch) => {
                    if (err) return done(err);
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                });

            } catch (error) {
                return done(error);
            }
        }
    ));
};
