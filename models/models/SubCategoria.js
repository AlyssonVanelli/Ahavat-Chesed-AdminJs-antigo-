var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubCategoriasSchema = new Schema({
    nome: String,
}, { collection: 'SubCategorias' })

var SubCategorias = mongoose.model('SubCategorias', SubCategoriasSchema)

module.exports = SubCategorias;