import express from 'express';
import InvoiceController from '../controllers/invoice.controller';

const router = express.Router();

// !GET
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
router.put('/:id', InvoiceController.updateInvoice);

module.exports = {
    invoiceRoute: router
};