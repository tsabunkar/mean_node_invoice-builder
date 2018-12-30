import express from 'express';
import ClientController from '../controllers/client.controller';

const router = express.Router();

// ?Alternatively
router.route('')
    .post(ClientController.createClient) // !POST
    .get(ClientController.findAllClient); // !GETALL


router.route('/:id')
    .get(ClientController.findClientById) // !GET
    .delete(ClientController.deleteClientById) // !DELETE
    .put(ClientController.updateClientById); // !PUT


module.exports = {
    clientRoutes: router
};