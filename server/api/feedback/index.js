'use strict';

var express = require('express');
var controller = require('./feedback.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.sendFeedback);
router.post('/encrypted', auth.isAuthenticated(), controller.sendEncryptedFeedback);
router.get('/public', auth.isAuthenticated(), controller.getFeedbackPublicKey);

module.exports = router;
