import mongoose, { Schema } from 'mongoose';

const voterSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    authorised: {
        type: Boolean,
        default: false,
    },
    votereceipt : {
        type: String,
        default: '',
    }
});

export const Voter = mongoose.model('Voter', voterSchema);
