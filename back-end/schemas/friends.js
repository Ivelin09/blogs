const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const FRIEND_STATUS = {
    requested: 1,
    pending: 2,
    friends: 3
};

const friendSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    status: {
        type: Number,
        enums: [
            FRIEND_STATUS.requested,
            FRIEND_STATUS.pending,
            FRIEND_STATUS.friends
        ]
    }
})

const Friend = mongoose.model('Blog', friendSchema);

module.exports = {
    Friend,
    FRIEND_STATUS
}; 