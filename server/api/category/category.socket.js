/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./category.model');

exports.register = function(socket) {
  thing.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  thing.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('category:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('category:remove', doc);
}
