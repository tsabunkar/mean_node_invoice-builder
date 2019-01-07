import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';


const generateJWTToken = (payload) => {

    const jwtToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return jwtToken;
};

const getEncryptedPassword = async password => {

    // !Generate a salt
    const salt = await bcryptjs.genSalt();
    // !generate a password hashed (salt + hash)
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
};


module.exports = {
    generateJWTToken,
    getEncryptedPassword
};