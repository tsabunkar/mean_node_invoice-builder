import express from 'express';
import ClientController from '../controllers/client.controller';

import passport from 'passport'; // importing passport twice bcoz it is singleton function

const router = express.Router();

// ?Alternatively
/* router.route('')
    .post(ClientController.createClient) // !POST
    .get(ClientController.findAllClient); // !GETALL


router.route('/:id')
    .get(ClientController.findClientById) // !GET
    .delete(ClientController.deleteClientById) // !DELETE
    .put(ClientController.updateClientById); // !PUT
 */

const authenticateRoute = passport.authenticate('jwt', {
    session: false
});

router.route('')
    .post(authenticateRoute, ClientController.createClient) // !POST
    .get(authenticateRoute, ClientController.findAllClient); // !GETALL


router.route('/:id')
    .get(authenticateRoute, ClientController.findClientById) // !GET
    .delete(authenticateRoute, ClientController.deleteClientById) // !DELETE
    .put(authenticateRoute, ClientController.updateClientById); // !PUT



module.exports = {
    clientRoutes: router
};