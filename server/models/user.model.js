import {
    mongoose
} from '../db/mongoose_config';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


/* const UserSchema = new mongoose.Schema({
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
}); */

// !Below schema make more scenes compare to above schema
const UserSchema = new mongoose.Schema({
    methodstosignup: { //it will tell us, what type of method used by end user to make his/her account ie- whether signedup using local authen, google authen or facebook authen
        type: String,
        enum: ['local', 'google', 'facebook'], //this methodstosignup can be either of this String value only
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true //bcoz for mongoose tsabunkar@gmail.com != TSABNKAR@GMAIL.COM
        },
        password: {
            type: String,
        }
    },
    google: {
        email: {
            type: String,
            lowercase: true
        },
        googleId: {
            type: String
        },
        displayName: {
            type: String
        },
        token: {
            type: String
        },
    }

});

// !before saving to db execute below code(i.e- dont store the password as string rather hash it)
UserSchema.pre('save', async function (next) {
    const user = this;

    //isModified() -> used to chech if a particular property is modified/changed , rt->boolean
    // if (user.local.isModified('password')) {
    try {

        if (user.methodstosignup !== 'local') {
            console.log('Signing in with either, google or facebook');
            // !methods property is google or facebook then dont execute below code, return from here
            return next();
        }


        // !Generate a salt
        const salt = await bcryptjs.genSalt();
        // !generate a password hashed (salt + hash)
        const hashedPassword = await bcryptjs.hash(user.local.password, salt);
        // !Re-assigning hashed version over original plain text password
        user.local.password = hashedPassword;

    } catch (err) {
        const err2 = new Error();
        err2.message = 'sorry, unable to pre save';
        err2.status = 500;
        throw err2;
    }
    // }
    next();

});


//authenticating login credentials by creating a separate method
UserSchema.statics.findByCredentials = async function (enteredEmail, enteredPassword) {
    const UserModel = this; // !NOTE- Whenever using this in the function, never use arrow function

    const userObj = await UserModel.findOne({
        'local.email': enteredEmail
    });

    if (!userObj) { //if entered emailId doesnot exist in the DB
        const err = new Error();
        err.message = 'sorry, invalid email';
        err.status = 500;
        throw err;
    }
    return checkThePassword(enteredPassword, userObj);
};


const checkThePassword = async (enteredPassword, userObj) => {

    const matched = await bcryptjs.compare(enteredPassword, userObj.local.password);

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