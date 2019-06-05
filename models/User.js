const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema

const UserSchema = new Schema({
    vkontakteId: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    photo: {
        type: String,
        required: false
    }, 
    city: {
        type: Number,
        required: false
    }
});

mongoose.model('users', UserSchema);