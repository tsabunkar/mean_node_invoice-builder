import jsonwebtoken from 'jsonwebtoken';

const generateJWTToken = (payload) => {

    const jwtToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return jwtToken;
};

module.exports = {
    generateJWTToken
};