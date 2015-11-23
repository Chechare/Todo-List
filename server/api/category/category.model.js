'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  count:{
    type: Number,
    default: 0
  },
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
