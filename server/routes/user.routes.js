import express from 'express';
import UserController from '../controllers/user.contoller';

const router = express.Router();

// ?Alternatively
router.route('/signup')
    .post(UserController.registerUser); // !POST


/* router.route('/signin')
    .post(UserController.loginUser); // !POST */



module.exports = {
    userRoute: router
};