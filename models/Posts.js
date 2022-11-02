var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
    titulo: { type: String, required: true },
    image: { type: String },
    conteudoCurto: { type: String, required: true },
    conteudo: { type: String, required: true },
    slug: { type: String, required: true },
    referenceImage: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    categoriaPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaPosts',
        required: true
    },
    subCategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategorias',
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }
}, { collection: 'posts' })

var Posts = mongoose.model('Posts', postsSchema)

module.exports = Posts;