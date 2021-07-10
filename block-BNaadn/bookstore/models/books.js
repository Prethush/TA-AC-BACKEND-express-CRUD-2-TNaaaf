let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    pages: Number,
    publication: String,
    authorId: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    categories: [String]
}, {timestamps: true});


module.exports = mongoose.model("Book", bookSchema);