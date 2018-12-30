import {
    mongoose
} from '../db/mongoose_config';


const clientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

const ClientModel = mongoose.model('client_collection', clientSchema);

module.exports = {
    ClientModel
};