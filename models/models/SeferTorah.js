var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sefertorahSchema = new Schema({
    parasha:String,
    doador:String,
},{collection:'sefertorah'})

var SeferTorah = mongoose.model('SeferTorah',sefertorahSchema)

module.exports = SeferTorah;