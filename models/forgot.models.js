const mongoose = require('mongoose');
const validator = require('validator');


const forgotPasswordSchema = new mongoose.Schema({
    verify_id : {
        type : String,
        required : true,
        trim : true
    },
    user_id : {
        type : String,
        required : true,
        trim : true
    },
    createdAt : {
        type : Date,
        required : true,
        default: Date.now()
    }
})

const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema);

module.exports = forgotPassword;