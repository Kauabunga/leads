'use strict';

var express = require('express');
var controller = require('./lead.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.sendLead);
router.post('/encrypted', auth.isAuthenticated(), controller.sendEncryptedLead);

// router.get('/public', auth.isAuthenticated(), controller.getLeadPublicKey);
router.get('/public', controller.getLeadPublicKey);

module.exports = router;
