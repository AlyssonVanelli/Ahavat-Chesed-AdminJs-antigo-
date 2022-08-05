var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaNoticiasSchema = new Schema({
    categoria: String,
}, { collection: 'categoriaNoticias' })

var CategoriaNoticias = mongoose.model('CategoriaNoticias', categoriaNoticiasSchema)

module.exports = CategoriaNoticias;