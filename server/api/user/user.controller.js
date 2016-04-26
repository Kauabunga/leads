'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import uuid from 'uuid';


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {

  let email = req.body && req.body.email && req.body.email.toLowerCase();

  if( ! email){ return res.status(400).send(); }

  var newUser = new User({ email });

  newUser.provider = 'local';
  newUser.role = isDefaultAdminEmail(email) ? 'admin' : 'user';
  newUser.password = `random-${uuid.v4()}`;

  return User.findOne({ email })
    .exec()
    .then(user => {
      if(user){
        user.role = newUser.role;
        user.provider = newUser.provider;
        return user.save();
      }
      else { return newUser.save(); }
    })
    .then(user => {
      if(user){
        console.log(`Got user ${user.email}`);
        return user.sendEmailToken()
          .then(() => {
            return res.status(200).send();
          })
          .catch(err => {
            console.error(`ERROR: Could not send user token email`, err);
            return res.status(500).send();
          });
      }
      else {
        console.error(`ERROR: Could not find/create user`);
        return res.status(500).send();
      }
    })
    .catch(err => {
      console.error(`ERROR: Could not find/create user`, err);
      return res.status(500).send();
    });
}

function handleCreate(res, email){
  return function(){
    return User.findOne({ email }).exec()
      .then(user => {


      });
  }
}

function isDefaultAdminEmail(email){

  let defaultAdminEmails = config.defaultAdminEmail || '';

  let adminEmails = _(defaultAdminEmails.split(','))
    .map((email = '') => email.trim())
    .filter()
    .value();

  console.log('Default admin emails', adminEmails);

  return adminEmails.indexOf(email) >= 0;
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
