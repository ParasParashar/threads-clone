import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: { type: String, required: true ,unique:true},
    image: String,
    bio: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Threads',
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);
export default Community;