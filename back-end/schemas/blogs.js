const { Schema } = require('mongoose');
const mongoose = require('mongoose');


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String
});

const User = mongoose.model('Users', userSchema);

module.exports = { User };