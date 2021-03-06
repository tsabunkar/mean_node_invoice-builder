import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';

import http from 'http'; // nodejs package, require() -> nodejs function
import logger from 'morgan';

import {
    invoiceRoute
} from './routes/invoice.routes';

import {
    clientRoutes
} from './routes/client.routes';

import {
    userRoute
} from './routes/user.routes';

import {
    authRoutes
} from './routes/auth.routes';

import {
    passportInitialConfiguration
} from './passportConfig';

import {
    passportJwtStrategy
} from './middleware/passport/jwt.strategy';

import {
    passportGoogleStrategy
} from './middleware/passport/google.strategy';

import {
    passportTwitterStrategy
} from './middleware/passport/twitter.strategy';

import {
    passportGitHubStrategy
} from './middleware/passport/github.strategy';




const app = express();


// !*NOTE: Instead of installing spearate middleare for parsing req and resp, we can use express itself :)
app.use(express.json()); // !middleware which parses incoming request in JSON format, this body-parser middleware must be
// !registered with express so wrote inside app.use();

app.use(express.urlencoded({ // to parse
    extended: false
}));

// !Using Morgan middleware for logging purposes
app.use(logger('dev'));



// !CORS error-
app.use((req, resp, next) => {
    // before contiuing the request to next middle ware just written below this middleware want to remove CORS error
    resp.setHeader('Access-Control-Allow-Origin', '*'); // allowing access to all the url/paths
    resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // it may have this headers key
    resp.setHeader('Access-Control-Expose-Headers', 'record-count, my-token, x-auth'); // Allowing to custom-header expose to frontend
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});



// !Intializing Passport
passportInitialConfiguration(app);

passportJwtStrategy(); // !Registering JWT Stratergy
passportGoogleStrategy(); // !Registering GOOGLE Stratergy
passportTwitterStrategy(); // !Registering TWITTER Stratergy
passportGitHubStrategy(); // !Resigstering GITHUB Stratergy




// !Swagger-UI
// http://localhost:3000/api-docs/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true
}));


// !filter routes with '/api/invoice' -> redirect to invoiceRoute
// http://localhost:3000/api/invoice
app.use('/api/invoice', invoiceRoute);

// http://localhost:3000/api/client
app.use('/api/client', clientRoutes);

// http://localhost:3000/api/user
app.use('/api/user', userRoute);

// http://localhost:3000/api/auth
app.use('/api/auth', authRoutes);


app.get('/failure', (req, resp) => {
    // resp.json({
    //     message:'tejas'
    // });
    resp.redirect('http://localhost:4200/login');
});



// !Creating a global level middleware for Error handling
app.use((req, resp, next) => {
    const error = new Error('Not Found');
    error.message = 'Invalid Route';
    error.status = 404;
    next(error);
});

// !Creating a error handling miidleware
app.use((error, req, resp, next) => { // eslint-disable-line
    resp.status(error.status || 500); // if end-user provides the status then use - error.status else 500
    return resp.json({
        message: error.message
    });
});









// validating the PORT
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
};


const PORT = normalizePort(process.env.PORT || '3000');

app.set('port', PORT); // setting port

const server = http.createServer(app); // create node server which uses express

server.listen(PORT); // start the server