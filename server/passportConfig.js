import passport from 'passport';
import expressSession from 'express-session';

const passportInitialConfiguration = (app) => {

    // !Passport also uses express-session (npm i express-session)
    app.use(expressSession({
        secret: process.env.JWT_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    // !Intializing Passport
    app.use(passport.initialize());
    // app.use(passport.initialize({
    //     userProperty: 'currentUser'
    // }));
    app.use(passport.session()); // !telling passport to use session module

    // !Serialize and Deserialize
    passport.serializeUser((user, done) => {
        done(null, user); //keeping the whole userobject in the session
    }); //using this serializeUser() fun we can place userObject into the session

    passport.deserializeUser((user, done) => {
        done(null, user);
    }); //using deserializeUser() fun we can get/fetch the userObject which was stored in the session


};

module.exports = {
    passportInitialConfiguration
};