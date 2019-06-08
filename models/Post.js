const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema

const PostSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    city: {
        type: Number,
        required: true
    },
    instrument: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date, 
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref:'users'
        }
    }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref:'users'
    }
});

mongoose.model('posts', PostSchema, 'posts');