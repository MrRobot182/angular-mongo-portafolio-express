'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    lang: String,
    image: String 
});

module.exports = mongoose.model('projects',projectSchema);