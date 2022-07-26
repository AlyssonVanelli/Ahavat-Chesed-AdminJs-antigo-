var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noticiasSchema = new Schema({
    titulo: String,
    image: String,
    conteudoCurto: String,
    conteudo: String,
    slug: String,
    referenceImage: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    categoriaNoticia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaNoticias',
        required: true
    }
}, { collection: 'noticias' })

var Noticias = mongoose.model('Noticias', noticiasSchema)

module.exports = Noticias;