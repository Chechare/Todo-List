'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:query', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
//router.get('/query', controller.search);


module.exports = router;
