import {
    mongoose
} from '../db/mongoose_config';
import { Schema } from 'mongoose';


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
    client: {
        ref: 'client_collection',
        type: Schema.Types.ObjectId,
        required: true
    }
});

const InvoiceModel = mongoose.model('invoice_collection', invoiceSchema);

module.exports = {
    InvoiceModel
};