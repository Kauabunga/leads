/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/feedbacks              ->  index
 * POST    /api/feedbacks              ->  create
 * GET     /api/feedbacks/:id          ->  show
 * PUT     /api/feedbacks/:id          ->  update
 * DELETE  /api/feedbacks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import * as feedbackService from '../../components/feedback';


export function sendFeedback(req, res) {

  let email = req.user.email;

  return feedbackService.sendFeedback(_.merge(req.body, { email }))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function sendEncryptedFeedback(req, res){

  let encrypted = req.body.encrypted;
  let email = req.user.email;

  return feedbackService.sendEncryptedFeedback({ email, encrypted })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function getFeedbackPublicKey(req, res){

  return feedbackService.getFeedbackPublicKey()
    .then(respondWithResult(res, 200))
    .catch(handleError(res));

}


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error('Error in feedback controller', err);
    res.status(statusCode).send(err);
  };
}
