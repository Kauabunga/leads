/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/feedbacks', require('./api/feedback'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  app.get('/cordova.js', (req, res, next) => {
    res.header('content-type', 'text/javascript; charset=UTF-8');
    res.header('Cache-Control', `public, max-age=86400000`);
    res.status(200).send('window.isNotCordovaInstance = true;');
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
