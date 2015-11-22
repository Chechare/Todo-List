'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Original
var ThingSchema = new Schema({
  name: String,
  info: String,
  tag: String,
  date: String,
  completed: Boolean,
});

//New Model
var TaskSchema = new Schema({
  name: String,
  info: String,
  tag: String,
  date: String,
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
