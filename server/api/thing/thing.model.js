'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//New Model
var TaskSchema = new Schema({
  name: String,
  info: String,
  date: String,
  tag: {
    default: null,
    type: String
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reminder: {
    type: Date,
    default: null
  },
});

//module.exports = mongoose.model('Thing', ThingSchema);
module.exports = mongoose.model("Task", TaskSchema);
