/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
var MongoStore = connectMongo(session);

export default function(app) {
  var env = app.get('env');

  if('production' === env && config.forceHttps){
    app.use(forceSsl);
  }

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'bbq'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if ('test' !== env) {
    app.use(lusca({

      //TODO reintroduce this and support it on devices
      //csrf: { angular: true },

      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  app.set('appPath', path.join(config.root, 'client'));

  if ('production' === env) {
    // app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath'), {setHeaders: setStaticHeaders}));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(require('connect-livereload')());
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));

    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}

function forceSsl(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
}

function setStaticHeaders(res, path, stat){

  if(path){
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! NEVER cache the service worker !!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if(path.indexOf('service-worker.js') !== -1){ return; }

    if(path.indexOf('.ttf') !== -1 ||
      path.indexOf('.css') !== -1 ||
      path.indexOf('.js') !== -1 ||
      path.indexOf('.png') !== -1){
      res.setHeader('Cache-Control', `public, max-age=${getStaticAge()}`);
    }
  }

}

function getStaticAge(){
  return config.staticCacheAge || 86400000; // 1day
}
