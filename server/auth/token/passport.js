import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import uuid from 'uuid';
import moment from 'moment';
import config from '../../config/environment';

function localAuthenticate(User, email, password, done) {
  
  return User.findOne({
    uuid: password
  }).exec()
    .then(user => {

      if ( ! user) {
        return done(null, false, { message: 'The token does not match' });
      }

      // limit the token lifetime to ~2hours
      if(isExpiredUserToken(user)){
        return done(null, false, { message: 'The token does not match' });
      }

      // Remove token password on successful authentication
      user.password = uuid.v4();
      user.uuid = uuid.v4();

      //change the last created token date to the past so the user can go and create a new token if they logout
      user.lastTokenCreatedDate = new Date();
      user.lastTokenCreatedDate.setDate(user.lastTokenCreatedDate.getDate() - 1);

      return user.save()
        .then(updatedUser => {
          return done(null, updatedUser);
        });
    })
    .catch(err => {
      console.log('Error tokening login', err);
      return done(err);
    });
}

function isExpiredUserToken(user){
  return Math.abs(moment(user.lastTokenCreatedDate).diff(Date.now())) > config.tokenLifetime;
}

export function setup(User, config) {
  return passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}
