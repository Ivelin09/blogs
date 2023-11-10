const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    imagePath: {
        type: String,
        required: false,
        deafult: '/images/none_image.png'
    }
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog; 