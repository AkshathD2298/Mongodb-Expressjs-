var mongoose = require('mongoose');
var Schema = mongoose.Schema;
BookSchema = new Schema({    
title:String,
author:String,
price:Number,
pages:Number,


});
module.exports = mongoose.model('Book', BookSchema);