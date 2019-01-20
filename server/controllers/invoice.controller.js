import {
    InvoiceModel
} from '../models/invoice.model';

import joiValidation from '../helpers/request-validation';

const {
    ObjectID
} = require('mongodb');



const findAllInvoices = async (req, resp, next) => { // eslint-disable-line
    try {
        // const invoices = await InvoiceModel.find();
        // !Adding pagination feature

        let {
            pageSize, // limit of records to show in current page
            currentPage, // current-page or pageno end-user is in
            filterItem, // filtering document based on generic value entered (Only for Item field/property)
            sortFiled, // filed on which we want to sort for
            sortDirection // sort direction values can be -> asc, desc, ascending, descending, 1, or -1
        } = req.query;


        /*  let pageSize = 10;
         let currentPage = 1;
         const filterItem = 'a';
         let sortFiled = 'item';
         const sortDirection = 'descending'; */

        pageSize = +pageSize;
        currentPage = +currentPage;

        if (!pageSize || !currentPage) { // pageSize && currentPage are undefined or null (bcoz-pageSize and currentPage r required field)
            resp.status(500).json({
                message: 'PageSize,CurrentPage,filterItem,sortFiled,sortDirection value are not defined',
                data: '',
                status: 500
            });
            return;
        }

        // !Filter search result
        const query = {};
        if (filterItem) {
            // query.item = filterItem; // filter documents on the complete item passed from frontend
            query.item = {
                $regex: filterItem //  $regex: -> similar to like operator in sql db
            };
        }

        const invoices = await InvoiceModel.find(query) // find all documents
            .skip(pageSize * (currentPage - 1)) // we will not retrieve all records, but will skip first 'n' records
            .limit(pageSize) // will limit/restrict the number of records to display
            .sort({
                // 'item': sortDirection
                [sortFiled]: sortDirection
            }) // sorting the documents
            .populate('client');
        // !will populate the compolete client property document in this invoice document
        // !for ex ->
        /*  {
             "_id": "5c287d94a5e0794858ac4e85",
             "item": "Amazon",
             "quantity": 1,
             "date": "2018-12-27T00:00:00.000Z",
             "dueDate": "2018-12-27T00:00:00.000Z",
             "rate": 12,
             "tax": 13.2,
             "client": { //! completed client document is populated here
               "_id": "5c287d89a5e0794858ac4e84",
               "firstName": "Tejas2",
               "lastName": "Sabunk2",
               "gender": true,
               "email": "tsabud@gmail.com",
               "__v": 0
             },
             "__v": 0
           } */



        const numberOfInvoice = await InvoiceModel.countDocuments(); // count the number of records for that model

        resp.setHeader('record-count', numberOfInvoice);
        resp.status(200).json({
            message: 'fetched all records',
            data: invoices,
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
        }).populate('client'); // findone invoice, but also with the sub-client object inside the invoice object

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