import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sessionTokenSchema = new Schema({
    from: {
        type: String,
        unique: true,
    },
    stage: {
      type: Number,
    }
}, { timestamps: true });

export default mongoose.model('SessionToken', sessionTokenSchema, 'sessionTokens');