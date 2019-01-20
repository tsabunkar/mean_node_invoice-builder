import joiValidation from '../helpers/request-validation';

import {
    UserModel
} from '../models/user.model';

import {
    generateJWTToken,
    // getEncryptedPassword
} from '../helpers/generate-jwt-utility';

import {
    sendEmailToClientForResetPassword
} from '../helpers/mail';


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

const forgotPassword = async (req, resp) => {

    const {
        error,
        value
    } = joiValidation.joiValidationForForgotPassword(req);

    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }

    try {

        // ! or logic to check weather email exist in google or github or local
        const criteria = {
            $or: [{
                    'google.email': value.email
                },
                {
                    'github.email': value.email
                },
                {
                    'local.email': value.email
                },
            ]
        };
        // console.log('--criteria', criteria);
        const userObject = await UserModel.findOne(criteria);
        // console.log('userObject', userObject);
        if (!userObject) {
            resp.status(500).json({
                message: 'User not found',
                data: '',
                status: 500
            });
            return;
        } else if (userObject.methodstosignup !== 'local') {
            // !3rd party forgot password is under consrtuction
            const message = `Sorry you have signed it with ${userObject.methodstosignup}, please register/signup or signin again with ${userObject.methodstosignup}`;
            resp.status(500).json({
                message: message,
                data: '',
                status: 500
            });
            return;
        }

        // !if user is found, then generate jwt token
        const token = generateJWTToken({
            _id: userObject._id
        });

        // !Create reset link
        const resetLink =
            `<h1>Hi there! 🐫</h1>
        <div>You recently asked to reset your account password.</div>
        <div> Click here to <a href='${process.env.FRONTEND_URL}/resetpassword/${token}'>reset</a>
        your password.</div>
        <p>If you did not request a new password, 🍄 please let us know immediately to our customer care.<p>
        <div> Thank you !! </div>
        `;
        console.log('reset link is send to end-client');
        console.log('method to signup', userObject.methodstosignup);

        // !logic to check forgot user is from local strategy or from 3rd party vendor
        let emailVal;
        if (userObject.methodstosignup === 'local') {
            console.log('local strategy');
            emailVal = userObject.local.email;
        } else if (userObject.methodstosignup === 'google') {
            console.log('Google strategy');
            emailVal = userObject.google.email;
        } else if (userObject.methodstosignup === 'github') {
            console.log('Github strategy');
            emailVal = userObject.google.github;
        }

        const options = {
            html: resetLink,
            subject: 'Reset your InvoiceBuilder Password 👍',
            email: emailVal // !if user has logged in with google, but clicks of forgot password
            // ! same shld be done for other vendors also
        };
        const result = await sendEmailToClientForResetPassword(options);

        resp.json({
            message: result
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }
};
/*
const resetPassword = async (req, resp) => {
    const { //! getting password from request object
        password
    } = req.body;

    if (!password) {
        resp.status(500).json({
            message: 'Password is required field',
            data: '',
            status: 500
        });
        return;
    }
    try {

        const userObj = await UserModel.findById(req.user._id);

        if (userObj.methodstosignup !== 'local') {
            // !if already logged in with 3rd party vendors,
            // !then, create new creds in local strategy (both local.email and local.password)

            const newlyCreatedUserObj = new UserModel();
            newlyCreatedUserObj.methodstosignup = 'local';
            newlyCreatedUserObj.local.email = userObj.google.email;
            newlyCreatedUserObj.local.password = password;

            await newlyCreatedUserObj.save();

        } else {
            // !if end-client form local strategy then just update the password (or) end-client from 3rd party
            // !vendor then create the local.email in the above if statement, later create a new local.password field

            // const hashPassword = await getEncryptedPassword(password);
            // userObj.local.password = hashPassword;

            // !hashing of above password is not required, since before save() we already did hashing of password
            userObj.local.password = password;
            await userObj.save();
        }

        resp.json({
            message: 'Password rested successfully'
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

}; */

const resetPassword = async (req, resp) => {
    const { //! getting password from request object
        password
    } = req.body;

    if (!password) {
        resp.status(500).json({
            message: 'Password is required field',
            data: '',
            status: 500
        });
        return;
    }
    try {

        const userObj = await UserModel.findById(req.user._id);

        if (userObj.methodstosignup !== 'local') {
            // !if already logged in with 3rd party vendors,
            // !then, create new creds in local strategy (both local.email and local.password)

            /* const newlyCreatedUserObj = new UserModel();
            newlyCreatedUserObj.methodstosignup = 'local';
            newlyCreatedUserObj.local.email = userObj.google.email;
            newlyCreatedUserObj.local.password = password;

            await newlyCreatedUserObj.save(); */
            const message = `Sorry you have signed it with ${userObj.methodstosignup}, please register/signup or signin again with ${userObj.methodstosignup}`;
            resp.status(500).json({
                message: message,
                data: '',
                status: 500
            });
            return;

        } else {
            // !if end-client form local strategy then just update the password (or) end-client from 3rd party
            // !vendor then create the local.email in the above if statement, later create a new local.password field

            // const hashPassword = await getEncryptedPassword(password);
            // userObj.local.password = hashPassword;

            // !hashing of above password is not required, since before save() we already did hashing of password
            userObj.local.password = password;
            await userObj.save();
        }

        resp.json({
            message: 'Password rested successfully'
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
    loginUser,
    test,
    forgotPassword,
    resetPassword
};