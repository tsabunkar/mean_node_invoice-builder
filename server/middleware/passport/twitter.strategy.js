import passport from 'passport';
import TwitterStrategy from 'passport-twitter';

import {
    UserModel
} from '../../models/user.model';


const passportTwitterStrategy = () => {
    console.log('-----Im here----');
    console.log(process.env.TWITTER_CONSUMER_KEY);
    console.log(process.env.TWITTER_CONSUMER_SECRET);
    console.log(process.env.TWITTER_REDIRECT_URL);

    passport.use(new TwitterStrategy.Strategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_REDIRECT_URL,
            passReqToCallback: true
        },
        async (token, tokenSecret, profile, done) => {
            try {
                console.log('-----Twitter profile', profile);

                const userObj = await UserModel.findOne({ // !find user with google profile id
                    'twitter.twitterId': profile.id
                });


                // !if userObject exist with google profile id then, he is already authenticated
                if (userObj) {
                    return done(null, userObj); // !skip the below code of saving to db
                }

                // !userObject doesnot exit in the db, then he is new user so, create a new user accont
                const newUser = new UserModel({});

                newUser.methodstosignup = 'twitter';
                newUser.twitter.username = profile.username;
                newUser.twitter.twitterId = profile.id;
                newUser.twitter.displayName = profile.displayName;
                newUser.twitter.token = token;

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
    passportTwitterStrategy
};