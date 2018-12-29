import {
    mongoose
} from '../db/mongoose_config';


const invoiceSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    rate: {
        type: Number
    },
    tax: {
        type: Number
    },
});

const InvoiceModel = mongoose.model('invoice_collection', invoiceSchema);

module.exports = {
    InvoiceModel
};