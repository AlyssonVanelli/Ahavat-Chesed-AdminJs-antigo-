var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var destaqueMobileSchema = new Schema({
    titulo:String,
    image:String,
    url:String,
},{collection:'destaquesMobile'})

var DestaquesMobile = mongoose.model('DestaquesMobile',destaqueMobileSchema)

module.exports = DestaquesMobile;