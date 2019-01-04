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
        new JwtStrategy(opts, (payload, done) => {
            UserModel.findOne({
                _id: payload._id
            }, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });

        })
    );
};

module.exports = {
    passportJwtStrategy
};