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


const generatingAuthTokenForSocialAggregator = (req, resp) => {

    // console.log('isAuthenticated', req.isAuthenticated());
    if (req.isAuthenticated()) {

        const tokenValue = jsonwebtoken.sign({
            _id: req.user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        resp.status(200);
        // !token from vendor is stored in queryParam, instead of header
        resp.redirect(`${process.env.FRONTEND_URL}/dashboard/invoices?authtoken=${tokenValue}`);


    } else { // not authenticated yet
        resp.status(500).json({
            message: 'User is not authenticated by yet!!',
        });
    }
};


const userValidated = (req, resp) => {
    return resp.send(true); // since user is authenticated by vendor(like-google,fb,.. so return true)
};

const logoutCurrentUser = (req, resp) => {
    // ! logout() method is given passoprt - http://www.passportjs.org/docs/logout/
    req.logout(); // removes the session and remove the req.user (i.e-user object)
    return resp.json({
        message: 'Successfully logged out!'
    });
};


module.exports = {
    generatingAuthTokenForSocialAggregator,
    userValidated,
    logoutCurrentUser
};