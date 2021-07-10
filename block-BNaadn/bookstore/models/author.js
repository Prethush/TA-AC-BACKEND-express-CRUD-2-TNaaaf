let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let authorSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, lowercase: true},
    country: String,
    books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
}, {timestamps: true});

module.exports = mongoose.model('Author', authorSchema);