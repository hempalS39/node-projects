const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required:true
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subcategory: [String],

    publishedAt: String,

    createdAt: Date,
    updatedAt: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: String,
    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema)