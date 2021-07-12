let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let coverImagePath = 'images/bookCovers';

let bookSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    pages: Number,
    publication: String,
    authorId: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    categories: [String],
    coverImage: String
}, {timestamps: true});


module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImagePath = coverImagePath;