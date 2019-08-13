'use strict';

var express = require('express');
var controller = require('./import.controller');
var router = express.Router();
var bodyParser = require('body-parser');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.use(bodyParser.urlencoded({
	extended: false
}));
router.use(bodyParser.json());

router.post('/import', controller.ImportControl);
router.get('/export',controller.ExportControl)

module.exports = router;