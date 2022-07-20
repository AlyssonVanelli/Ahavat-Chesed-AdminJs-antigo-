var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaPostsSchema = new Schema({
    categoria: String,
}, { collection: 'categoriaPosts' })

var CategoriaPosts = mongoose.model('CategoriaPosts', categoriaPostsSchema)

module.exports = CategoriaPosts;