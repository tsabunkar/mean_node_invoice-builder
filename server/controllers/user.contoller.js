import joiValidation from '../helpers/request-validation';

import {
    UserModel
} from '../models/user.model';

import jwt from 'jsonwebtoken';


const registerUser = async (req, resp, next) => { // eslint-disable-line
    const {
        error,
        value
    } = joiValidation.joiValidationForCreateUser(req);

    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }

    const userModel = new UserModel(value);
    try {
        const userCreated = await userModel.save();

        if (!userCreated) {
            resp.status(500).json({
                message: 'Failed to create User Object',
                data: '',
                status: 500
            });
            return;
        }

        resp.status(200).json({
            message: 'user created succesfully!',
            data: userCreated.email,
            status: 200
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

};



const loginUser = async (req, resp, next) => { // eslint-disable-line
    const {
        error,
        value
    } = joiValidation.joiValidationForLoginUser(req);

    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }


    try {
        const userObject = await UserModel.findByCredentials(value.email, value.password);

        const token = userObject.generateAuthenticationToken();

        resp.status(200).json({
            message: 'user loggedin successfully!',
            data: userObject,
            token: token,
            status: 200
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

};




module.exports = {
    registerUser,
    loginUser
};