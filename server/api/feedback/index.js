'use strict';

var express = require('express');
var controller = require('./feedback.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
