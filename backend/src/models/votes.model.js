import mongoose, { Schema } from 'mongoose';

const voteSchema = new Schema({
    encryptedVotec1: {
        type: String,
        required: true,
    },
    encryptedVotec2:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Vote = mongoose.model('Vote', voteSchema);
