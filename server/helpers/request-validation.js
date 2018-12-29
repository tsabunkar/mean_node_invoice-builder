import Joi from 'joi';


const joiValidationForCreateInvoice = (req) => {
    // !Instead of we validating the request body - weather particular property is there, data-type of a
    // ! property is correct, We can use Joi for validating our  http reqest body matches our mongooses schema
    const idealSchemaForInvoiceModel = Joi.object().keys({
        item: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        date: Joi.date().required(),
        dueDate: Joi.date().required(),
        rate: Joi.number().required(),
        tax: Joi.number().optional()
    });

    // !JOI is mainly used to validate our schema
    // !Below JOi is validation our Idealschema with the request body send by frontend (instead we
    // !writing each validation logic manually)
    const { error, value } = Joi.validate(req.body, idealSchemaForInvoiceModel);

    return { error, value };
};


const joiValidationForUpdateInvoice = (req) => {

    const idealSchemaForInvoiceModel = Joi.object().keys({
        item: Joi.string().optional(),
        quantity: Joi.number().integer().optional(),
        date: Joi.date().optional(),
        dueDate: Joi.date().optional(),
        rate: Joi.number().optional(),
        tax: Joi.number().optional()
    });

    const { error, value } = Joi.validate(req.body, idealSchemaForInvoiceModel);

    return { error, value };
};




module.exports = {
    joiValidationForCreateInvoice,
    joiValidationForUpdateInvoice
};
