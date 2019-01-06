import jsonwebtoken from 'jsonwebtoken';

/* const signedToken = (userObj) => {
    const token = jsonwebtoken.sign({
        iss: 'Sabunkar', //issurer name
        sub: userObj._id, //subject -> it will connect this token to ur actual document in the DB
        iat: new Date().getTime(), //issued at -> time when this token was signed/encrypted
        exp: new Date().setDate(new Date().getDate() + 1), //expiration date of this token (expiring tomorrow)
        userObj
    }, process.env.JWT_SECRET); //encoding this new UserObj object -> to hashcode value

    return token;

}; */


const generatingAuthTokenForGoogleId = (req, resp) => {

    // console.log('isAuthenticated', req.isAuthenticated());
    if (req.isAuthenticated()) {
        const tokenValue = jsonwebtoken.sign({
            _id: req.user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        // const tokenValue = signedToken(req.user);
        resp.header('x-auth', tokenValue);

        resp.status(200).json({
            message: 'user loggedin successfully!',
        });
    } else { // not authenticated yet
        resp.status(500).json({
            message: 'User is not authenticated by google yet!!',
        });
    }
};



module.exports = {
    generatingAuthTokenForGoogleId
};