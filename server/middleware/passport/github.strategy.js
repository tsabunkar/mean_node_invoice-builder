import passport from 'passport';
import GitHubStrategy from 'passport-github';

import {
    UserModel
} from '../../models/user.model';



const passportGitHubStrategy = () => {
    passport.use(new GitHubStrategy.Strategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_REDIRECT_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const userObj = await UserModel.findOne({ // !find user with google profile id
                    'github.githubId': profile.id
                });


                // !if userObject exist with google profile id then, he is already authenticated
                if (userObj) {
                    return done(null, userObj); // !skip the below code of saving to db
                }

                // !userObject doesnot exit in the db, then he is new user so, create a new user accont
                const newUser = new UserModel({});

                newUser.methodstosignup = 'github';
                newUser.github.email = profile.emails[0].value;
                newUser.github.githubId = profile.id;
                newUser.github.displayName = profile.displayName;
                newUser.github.token = accessToken;

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
    passportGitHubStrategy
};