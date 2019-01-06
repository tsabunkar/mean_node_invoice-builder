import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';

import {
    UserModel
} from '../../models/user.model';



// Use the GoogleStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Google
// profile), and invoke a callback with a user object.
const passportGoogleStrategy = () => {
    passport.use(new GoogleStrategy.OAuth2Strategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const userObj = await UserModel.findOne({ // !find user with google profile id
                    'google.googleId': profile.id
                });


                // !if userObject exist with google profile id then, he is already authenticated
                if (userObj) {
                    return done(null, userObj); // !skip the below code of saving to db
                }

                // !userObject doesnot exit in the db, then he is new user so, create a new user accont
                const newUser = new UserModel({});

                newUser.methodstosignup = 'google';
                newUser.google.email = profile.emails[0].value;
                newUser.google.googleId = profile.id;
                newUser.google.displayName = profile.displayName;
                newUser.google.token = accessToken;

                const userObjSaved = await newUser.save(); // !Note- before this save, Userschema.Pre save will be invoked
                if (!userObjSaved) {
                    done('Error occured while saving');
                }
                done(null, newUser);

            } catch (err) {
                return done(err);
            }
        }
    ));
};


module.exports = {
    passportGoogleStrategy
};