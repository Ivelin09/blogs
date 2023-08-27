const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    imagePath: {
        type: String,
        unique: false,
        required: false,
        default: "profile_images/unkown.png"
    }
});


const User = mongoose.model('Users', userSchema);

module.exports = User;