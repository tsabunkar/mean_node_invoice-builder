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

router.route('')
    .post(passport.authenticate('jwt', {
        session: false
    }), ClientController.createClient) // !POST

    .get(passport.authenticate('jwt', {
        session: false
    }), ClientController.findAllClient); // !GETALL


router.route('/:id')
    .get(passport.authenticate('jwt', {
        session: false
    }), ClientController.findClientById) // !GET

    .delete(passport.authenticate('jwt', {
        session: false
    }), ClientController.deleteClientById) // !DELETE

    .put(passport.authenticate('jwt', {
        session: false
    }), ClientController.updateClientById); // !PUT



module.exports = {
    clientRoutes: router
};