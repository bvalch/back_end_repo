const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

    userName: {
        type: String,
        required: true

    },
    pass: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
   

});

module.exports = mongoose.model('User', userSchema);