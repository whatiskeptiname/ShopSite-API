var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema(
    {
        title: String,
        price: Number,
        imgUrl: String
    }
);

module.exports = mongoose.model('Product', product);