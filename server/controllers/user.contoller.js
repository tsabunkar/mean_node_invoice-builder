import joiValidation from '../helpers/request-validation';

import {
    UserModel
} from '../models/user.model';


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

    // const userModel = new UserModel(value);

    const userObj = new UserModel();
    userObj.methodstosignup = 'local';
    userObj.local.email = value.email;
    userObj.local.password = value.password;

    try {
        const userCreated = await userObj.save();

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
        resp.header('x-auth', token);
        resp.status(200).json({
            message: 'user loggedin successfully!',
            data: userObject,
            // token: token,
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

const test = (req, resp) => {

    resp.status(200).json({
        data: 'success',
        status: 200
    });

};



module.exports = {
    registerUser,
    loginUser,
    test
};