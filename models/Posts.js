var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
    titulo: String,
    image: String,
    conteudoCurto: String,
    categoria: String,
    conteudo: String,
    slug: String,
    referenceImage: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, { collection: 'posts' })

var Posts = mongoose.model('Posts', postsSchema)

module.exports = Posts;