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
                // A findOne callback helyett async/await-et használunk
                const user = await User.findOne({ email }); // Így már Promise-alapú

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                // comparePassword maradhat callback-es, ha a modelben úgy definiáltad
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
