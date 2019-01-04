import {
    mongoose
} from '../db/mongoose_config';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});


// !before saving to db execute below code(i.e- dont store the password as string rather hash it)
UserSchema.pre('save', async function (next) {
    const user = this;

    //isModified() -> used to chech if a particular property is modified/changed , rt->boolean
    if (user.isModified('password')) {
        try {
            const salt = await bcryptjs.genSalt();
            const hashedPassword = await bcryptjs.hash(user.password, salt);
            user.password = hashedPassword;
        } catch (err) {
            const err2 = new Error();
            err2.message = 'sorry, unable to pre save';
            err2.status = 500;
            throw err2;
        }
    }
    next();

});


//authenticating login credentials by creating a separate method
UserSchema.statics.findByCredentials = async function (enteredEmail, enteredPassword) {
    const UserModel = this; // !NOTE- Whenever using this in the function, never use arrow function

    const userObj = await UserModel.findOne({
        'email': enteredEmail
    });

    if (!userObj) { //if entered emailId doesnot exist in the DB
        const err = new Error();
        err.message = 'sorry, invalid username';
        err.status = 500;
        throw err;
    }

    return checkThePassword(enteredPassword, userObj);
};


const checkThePassword = async (enteredPassword, userObj) => {

    const matched = await bcryptjs.compare(enteredPassword, userObj.password);

    if (!matched) {
        // !password didn't match
        const err = new Error();
        err.message = 'sorry, password did not match';
        err.status = 500;
        throw err;
    }

    return userObj;

};



UserSchema.methods.generateAuthenticationToken = function () {
    //using normal fun bcoz this keyword doesn't supports ==> 'this'
    const userObj = this;

    const jwtToken = jwt.sign({
        _id: userObj._id
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return jwtToken;

};




const UserModel = mongoose.model('user_collection', UserSchema);

module.exports = {
    UserModel
};