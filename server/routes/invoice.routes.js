import express from 'express';
import InvoiceController from '../controllers/invoice.controller';
import passport from 'passport'; // importing passport twice bcoz it is singleton function

const router = express.Router();


/* // !GET
router.get('', InvoiceController.findAllInvoices);

// !GET by Id
router.get('/:id', InvoiceController.findInvoiceById);

// !DELETE by Id
router.delete('/:id', InvoiceController.deleteInvoicebyId);

// !DELETE All
router.delete('', InvoiceController.deleteAllInvoices);

// !POST
router.post('', InvoiceController.createInvoice);

// !PUT
router.put('/:id', InvoiceController.updateInvoice); */


// ?Alternatively
/* router.route('')
    .get(InvoiceController.findAllInvoices) // !GET ALL
    .post(InvoiceController.createInvoice) // !POST
    .delete(InvoiceController.deleteAllInvoices); // !DELETE All

router.route('/:id')
    .get(InvoiceController.findInvoiceById) // !GET by Id
    .delete(InvoiceController.deleteInvoicebyId) // !DELETE by Id
    .put(InvoiceController.updateInvoice); // !PUT */


const authenticateRoute = passport.authenticate('jwt', {
    session: false
});
router.route('')
    .get(authenticateRoute, InvoiceController.findAllInvoices) // !GET ALL
    .post(authenticateRoute, InvoiceController.createInvoice) // !POST
    .delete(authenticateRoute, InvoiceController.deleteAllInvoices); // !DELETE All

router.route('/:id')
    .get(authenticateRoute, InvoiceController.findInvoiceById) // !GET by Id
    .delete(authenticateRoute, InvoiceController.deleteInvoicebyId) // !DELETE by Id
    .put(authenticateRoute, InvoiceController.updateInvoice); // !PUT


module.exports = {
    invoiceRoute: router
};