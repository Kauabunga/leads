'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

let router = express.Router();

//50 attempts every 10mins
const AUTHENTICATION_ATTEMPT_LIMIT = 50;
const AUTHENTICATION_ATTEMPT_TIME = 1000 * 60 * 10; // 10mins

//Only allow the 50 attempts to enter a pin by a user every 10mins
let throttleEmailAttempts = (() => {
  let authenticationAttemptsEmailMap = {};
  return email => {
    authenticationAttemptsEmailMap[email] = authenticationAttemptsEmailMap[email] + 1 || 0;

    setTimeout(() => {
      authenticationAttemptsEmailMap[email] = Math.max(authenticationAttemptsEmailMap[email] - 1, 0);
    }, AUTHENTICATION_ATTEMPT_TIME);

    return authenticationAttemptsEmailMap[email] > AUTHENTICATION_ATTEMPT_LIMIT;
  };
})();


router.post('/', function(req, res, next) {

  return passport.authenticate('local', function(err, user, info) {

    if(user && throttleEmailAttempts(user.email)){
      console.error('Invalid number of attempts for email', user.email);
      return res.status(401).json({message: 'The email and token do not match'});
    }

    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = signToken(user._id, user.role);
    return res.json({ token, user });

  })(req, res, next);
});

export default router;
