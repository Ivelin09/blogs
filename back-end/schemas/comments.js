const { Schema } = require('mongoose');
const mongoose = require('mongoose');


const comment = new Schema({
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    subComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
})

const Comment = mongoose.model('Comment', comment);

module.exports = Comment;