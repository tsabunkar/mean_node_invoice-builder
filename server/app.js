import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';

import http from 'http'; // nodejs package, require() -> nodejs function
import logger from 'morgan';

import {
    invoiceRoute
} from './routes/invoice.routes';



const app = express();


// !*NOTE: Instead of installing spearate middleare for parsing req and resp, we can use express itself :)
app.use(express.json());// !middleware which parses incoming request in JSON format, this body-parser middleware must be
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
    resp.setHeader('Access-Control-Expose-Headers', 'max-records, my-token'); // Allowing to custom-header expose to frontend
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});




// !Swagger-UI
// http://localhost:3000/api-docs/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true
}));


// !filter routes with '/api/invoice' -> redirect to invoiceRoute
app.use('/api/invoice', invoiceRoute);



// !Creating a global level middleware for Error handling
app.use((req, resp, next) => {
    const error = new Error('Not Found');
    error.message = 'Invalid Route';
    error.status = 404;
    next(error);
});

// !Creating a error handling miidleware
app.use((error, req, resp, next) => { // eslint-disable-line
    resp.status(error.status || 500); // if user provides the status then use - error.status else 500
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