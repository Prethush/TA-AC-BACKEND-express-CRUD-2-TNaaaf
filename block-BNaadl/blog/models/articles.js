let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    tags: [String],
    author: String,
    likes: Number
}, {timestamps: true});

module.exports = mongoose.model("Article", articleSchema);