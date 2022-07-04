const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: "title is required",
        trim:true
    },
    fname: {
        type: String,
        required: "fname is required",
        trim:true
    },
    lname: {
        type: String,
        required: "lname is required",
        trim:true
    },
    
    email: {
        type: String,
        unique: true,
        trim:true,
        required: "email is required"
    },
    password: {
        type: String,
        required: "paswered is required"
    }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)
