import mongoose, {Schema} from 'mongoose';

const AuthoritySchema = new Schema({
    authorityId: Number,
    shareX: String,
    shareY: String
});

export const Authority = mongoose.model('Authority', AuthoritySchema);