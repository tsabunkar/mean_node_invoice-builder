import {
    mongoose
} from '../db/mongoose_config';

import {
    bcryptjs
} from 'bcryptjs';


const UserSchema = mongoose.Schema({
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
/* UserSchema.pre('save', async function (next) {
    const user = this;
    console.log('user', user);
    console.log('**', user.isModified('password'));
    // if user is modified or user is new
    if (user.isModified('password')) {

        //   const salt = await bcryptjs.genSalt();
        //   console.log(salt);
        // const hashedPassword = await bcryptjs.hash(user.password, salt);
        // console.log(hashedPassword);


        const hashedPassword = this.hashMyPassword(user);
        this.password = hashedPassword;

    }
    next();

}); */


UserSchema.pre('save', function (next) {
    const user = this;
    console.log('user', user);
    //isModified() -> used to chech if a particular property is modified/changed , rt->boolean
    const isPasswordModified = user.isModified('password');
    console.log(isPasswordModified);
    if (isPasswordModified) {
        const actualPassword = user.password;
        bcryptjs.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err);
            }
            console.log(salt);
            bcryptjs.hash(actualPassword, salt, (err, hashValue) => {
                if (err) {
                    console.log(err);
                }
                console.log('hashValue', hashValue);
                user.password = hashValue; //update the userObj password property with the hashedPassword value

            });
        });

    }

    next();

});


const UserModel = mongoose.model('user_collection', UserSchema);

module.exports = {
    UserModel
};