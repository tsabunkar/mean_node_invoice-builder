import express from 'express';
import UserController from '../controllers/user.contoller';
import passport from 'passport'; // importing passport twice bcoz it is singleton function

const router = express.Router();

// ?Alternatively
router.route('/signup')
    .post(UserController.registerUser); // !POST


router.route('/signin')
    .post(UserController.loginUser); // !POST

router.route('/test')
    .post(passport.authenticate('jwt', {
        session: false
    }), UserController.test); // !POST



module.exports = {
    userRoute: router
};