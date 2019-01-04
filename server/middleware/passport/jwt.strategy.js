import PassportJWT from 'passport-jwt';
import passport from 'passport';

import {
    UserModel
} from '../../models/user.model';


const passportJwtStrategy = () => {
    const JwtStrategy = PassportJWT.Strategy;
    const ExtractJwt = PassportJWT.ExtractJwt;

    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;
    // opts.issuer = 'accounts.examplesoft.com';
    // opts.audience = 'yoursite.net';

    // !JWT Strategy
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {

            try {
                const user = await UserModel.findOne({ // !Finding weather user object exist
                    _id: payload._id
                });

                if (user) { // !Success-path, if user objec exist in the db(valid user)
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }

            } catch (err) {
                return done(err, false);
            }

        })
    );
};

module.exports = {
    passportJwtStrategy
};