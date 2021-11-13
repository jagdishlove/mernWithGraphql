const mongoose = require('mongoose')
const { model, Schema } = mongoose;

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,


    Comments: [{
        body: String,
        username: String,
        createdAt: String
    }],
    likes: [{
        username: String,
        createdAt: String
    }],

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Post', postSchema);
