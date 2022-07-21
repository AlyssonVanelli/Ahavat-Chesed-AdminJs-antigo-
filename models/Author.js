var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    nome: String,
    descricao: String,
    image: String,
}, { collection: 'Author' })

var Author = mongoose.model('Author', AuthorSchema)

module.exports = Author;