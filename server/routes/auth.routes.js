import express from 'express';
import passport from 'passport';

const router = express.Router();

import {
    generatingAuthTokenForSocialAggregator,
    userValidated,
    logoutCurrentUser
} from '../controllers/auth.controller';


// ?_____________________GOOGLE____________________________________

// !below route Execute - First (this will open -> Sign in with <<Google Window>> )
// !http://localhost:3000/api/auth/google
/* router.route('/google')
    .get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile', // !Scope to fetch profile
            'https://www.googleapis.com/auth/userinfo.email'   // !Scope to fetch email addr
        ]
    })); */

// !Alternatively we can use scope as below code->

router.route('/google')
    .get(passport.authenticate('google', { // ! will invokes -> passportGoogleStrategy() [google.strategy.js]
        scope: [
            'profile',
            'email'
        ]
    }));



// !below route Execute - Second, (If Signin with google is succesfull, then generate Auth Token)
// !http://localhost:3000/api/auth/google/callback
router.route('/google/callback')
    .get(passport.authenticate('google', {
            failureRedirect: '/failure'
        }),
        generatingAuthTokenForSocialAggregator);



// ?_____________________TWITTER____________________________________

router.route('/twitter2')
    .get((req, resp) => {
        resp.json({
            mess: 'hellow'
        });
    }); // ! will invokes -> passportTwitterStrategy() [twitter.strategy.js]


router.route('/twitter')
    .get(passport.authenticate('twitter'));


router.route('/twitter/callback')
    .get(passport.authenticate('twitter', {
            failureRedirect: '/failure'
        }),
        generatingAuthTokenForSocialAggregator);

// ?_____________________GIT-HUB____________________________________


router.route('/github')
    .get(passport.authenticate('github'));

router.route('/github/callback')
    .get(passport.authenticate('github', {
            failureRedirect: '/failure'
        }),
        generatingAuthTokenForSocialAggregator);





// ?Authenticating the token present in the local storage(which is provided by 3rd party vendors) is valid one
const authenticateRoute = passport.authenticate('jwt', {
    session: false
});
// !authenticate the google,fb,.. token is a valid jwt token
router.get('/authenticate', authenticateRoute, userValidated);


// !Loging out the current loggedin user
router.get('/logout', authenticateRoute, logoutCurrentUser);

module.exports = {
    authRoutes: router
};