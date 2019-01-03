import joiValidation from '../helpers/request-validation';

import {
    UserModel
} from '../models/user.model';




const registerUser = async (req, resp, next) => { // eslint-disable-line
    const {
        error,
        value
    } = joiValidation.joiValidationForCreateUser(req);
    console.log(error);
    console.log(value);
    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }

    const userModel = new UserModel(value);
    console.log(userModel);
    try {
        console.log('before save');
        const userCreated = await userModel.save();
        console.log('userCreated', userCreated);

        if (!userCreated) {
            resp.status(500).json({
                message: 'Failed to create User Object',
                data: '',
                status: 500
            });
            return;
        }

        resp.status(200).json({
            message: 'You have created user succesfully!',
            data: userCreated.email,
            status: 200
        });

    } catch (err) {
        console.log('----error---');
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

};



module.exports = {
    registerUser
};