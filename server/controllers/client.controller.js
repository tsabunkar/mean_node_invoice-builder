import joiValidation from '../helpers/request-validation';

const {
    ObjectID
} = require('mongodb');


import {
    ClientModel
} from '../models/client.model';



const createClient = async (req, resp, next) => { // eslint-disable-line
    const {
        error,
        value
    } = joiValidation.joiValidationForCreateClient(req);

    if (error) {
        resp.status(500).json({
            message: error,
            data: '',
            status: 500
        });
        return;
    }

    const clientModel = new ClientModel(value);

    try {
        const clientCreated = await clientModel.save();

        if (!clientCreated) {
            resp.status(500).json({
                message: 'Failed to create Client Object',
                data: '',
                status: 500
            });
            return;
        }

        resp.status(200).json({
            message: 'You have created client/object succesfully!',
            data: clientCreated,
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

const findAllClient = async (req, resp, next) => { // eslint-disable-line
    try {
        const clients = await ClientModel.find(); // find all documents

        resp.status(200).json({
            message: 'fetched all records',
            data: clients,
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

const findClientById = async (req, resp, next) => { // eslint-disable-line

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
        const client = await ClientModel.findOne({
            _id: uriIdFetch
        });

        if (!client) {
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
            message: 'client found by the Id - ' + uriIdFetch,
            data: client,
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



const deleteClientById = async (req, resp, next) => { // eslint-disable-line

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
        const clientDeleted = await ClientModel.findOneAndRemove({ //findOneAndRemove() fun return promise Object so, use await :)
            _id: uriIdFetch,
        });


        if (!clientDeleted) {
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
            message: 'Client deleted successfully!',
            data: clientDeleted,
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





const updateClientById = async (req, resp, next) => { // eslint-disable-line

    const {
        error,
        value
    } = joiValidation.joiValidationForUpdateClient(req);

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
        const clientUpdated = await ClientModel.findOneAndUpdate({
            _id: uriIdFetch,
        }, value, {
            new: true
        });

        if (!clientUpdated) {
            resp.status(404).json({
                message: 'Id format is valid but no docu found with this id',
                data: '',
                status: 404
            });
            return;
        }

        //success
        resp.status(200).json({
            message: 'Client updated successfully',
            data: clientUpdated,
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
    createClient,
    findAllClient,
    findClientById,
    deleteClientById,
    updateClientById
};