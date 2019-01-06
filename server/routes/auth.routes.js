import express from 'express';
import passport from 'passport';

const router = express.Router();

import {
    generatingAuthTokenForGoogleId
} from '../controllers/auth.controller';


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
        generatingAuthTokenForGoogleId);







module.exports = {
    authRoutes: router
};