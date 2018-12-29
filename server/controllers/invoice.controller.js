import {
    InvoiceModel
} from '../models/invoice.model';

import joiValidation from '../helpers/request-validation';

const {
    ObjectID
} = require('mongodb');


const findAllInvoices = async (req, resp, next) => { // eslint-disable-line
    try {
        const invoices = await InvoiceModel.find();

        resp.status(200).json(invoices);

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

};


const createInvoice = async (req, resp, next) => { // eslint-disable-line

    /*   const {
            item,
            quantity,
            date,
            dueDate,
            rate,
            tax

        } = req.body; // destructring assignment



    if (!item || !quantity || !date || !dueDate) {

        //  resp.status(500).json({
        //      message: 'Please enter required filed'
        //  });

        // !Alternate approach of above code
        // !Throwing error to custom middleware

        const errorObj = new Error('Please enter required field');
        errorObj.status = 500;
        errorObj.message = 'Missing one of the required field';
        next(errorObj);
        return;
    }*/

    const {
        error,
        value
    } = joiValidation.joiValidationForCreateInvoice(req);

    if (error) {
        const errorObj = new Error('Request body Validation of Schema failed');
        errorObj.status = 500;
        errorObj.message = error;
        next(errorObj);
        return;
    }

    /*  const invoiceModel = new InvoiceModel({
         item,
         quantity,
         date,
         dueDate,
         rate,
         tax
     }); */
    const invoiceModel = new InvoiceModel(value);


    try {
        const invoiceCreated = await invoiceModel.save();
        // console.log('invoiceCreated', invoiceCreated);
        if (!invoiceCreated) {
            resp.status(500).json({
                message: 'Failed to create Inovice Object',
                data: '',
                status: 500
            });
            return;
        }

        resp.status(200).json({
            message: 'You have created object succesfully!',
            data: invoiceCreated,
            status: 200
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }



};


const findInvoiceById = async (req, resp, next) => { // eslint-disable-line

    const uriIdFetch = req.params.id;

    if (!ObjectID.isValid(uriIdFetch)) {
        resp.status(404).json({
            message: 'Id Format is not valid',
            data: '',
            status: 404
        });
        return;
    }
    try {
        const invoice = await InvoiceModel.findOne({
            _id: uriIdFetch
        });

        if (!invoice) {
            // If document is empty
            resp.status(404).json({
                message: 'Id format is valid but no docu found with this id',
                data: '',
                status: 404
            });
            return;
        }

        //success
        resp.status(200).json({
            message: 'Invoice found by the Id - ' + uriIdFetch,
            data: invoice,
            status: 200
        });
    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }

};

const deleteInvoicebyId = async (req, resp, next) => { // eslint-disable-line

    const uriIdFetch = req.params.id;

    if (!ObjectID.isValid(uriIdFetch)) {
        resp.status(404).json({
            message: 'Id Format is not valid',
            data: '',
            status: 404
        });
        return;
    }

    try {
        const invoiceDeleted = await InvoiceModel.findOneAndRemove({ //findOneAndRemove() fun return promise Object so, use await :)
            _id: uriIdFetch,
        });


        if (!invoiceDeleted) {
            // If document is empty
            resp.status(404).json({
                message: 'Id format is valid but no docu found with this id',
                data: '',
                status: 404
            });
            return;
        }

        //success
        resp.status(200).json({
            message: 'Invoice deleted successfully!',
            data: invoiceDeleted,
            status: 200
        });
    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }
};

const deleteAllInvoices = async (req, resp, next) => { // eslint-disable-line


    try {
        const invoicesDeleted = await InvoiceModel.deleteMany();


        if (!invoicesDeleted) {
            // If document is empty
            resp.status(404).json({
                message: 'Id format is valid but some error while deleting the documents',
                data: '',
                status: 404
            });
            return;
        }

        //success
        resp.status(200).json({
            message: 'All Invoices deleted successfully',
            data: invoicesDeleted,
            status: 200
        });
    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }
};


const updateInvoice = async (req, resp, next) => { // eslint-disable-line

    const {
        error,
        value
    } = joiValidation.joiValidationForUpdateInvoice(req);

    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }



    const uriIdFetch = req.params.id;

    if (!ObjectID.isValid(uriIdFetch)) {
        resp.status(404).json({
            message: 'Id Format is not valid',
            data: '',
            status: 404
        });
        return;
    }

    try {
        const invoiceUpdated = await InvoiceModel.findOneAndUpdate({
            _id: uriIdFetch,
        }, value, {
            new: true
        });

        if (!invoiceUpdated) {
            resp.status(404).json({
                message: 'Id format is valid but no docu found with this id',
                data: '',
                status: 404
            });
            return;
        }

        //success
        resp.status(200).json({
            message: 'Invoice updated successfully',
            data: invoiceUpdated,
            status: 200
        });

    } catch (err) {
        resp.status(500).json({
            message: err,
            data: '',
            status: 500
        });
    }


};




module.exports = {
    findAllInvoices,
    createInvoice,
    findInvoiceById,
    deleteInvoicebyId,
    deleteAllInvoices,
    updateInvoice
};