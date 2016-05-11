
import config from '../../config/environment';
import _ from 'lodash';
import cryptico from 'cryptico';
import * as emailService from '../email';


// The passphrase used to repeatably generate this RSA key.
// If this changes then all existing encrypted forms to sync are stuffed
const passPhrase = config.encyptionPassPhrase;
// The length of the RSA key, in bits.

const bits = 1024;
let RSAkey = cryptico.generateRSAKey(passPhrase, bits);
let feedbackPublicKeyString = cryptico.publicKeyString(RSAkey);


export function sendFeedback({email, feedback, contact = 'empty', name = 'empty'}) {

  if(! feedback ){
    return Promise.reject(new Error('No feedback passed to send feedback'));
  }

  let feedbackObject = {email, feedback, contact, name};
  return emailService.sendFeedbackEmail(feedbackObject);
}


export function sendEncryptedFeedback({ email, encrypted }) {

  if(! encrypted){
    return Promise.reject(new Error('No encrypted feedback passed to send encrypted feedback'));
  }

  return sendFeedback(_.merge({email}, decryptFeedback({ encrypted })));
}


export function getFeedbackPublicKey() {
  return Promise.resolve({publicKey: feedbackPublicKeyString});
}


function decryptFeedback({ encrypted }){

  let decryption = cryptico.decrypt(encrypted, RSAkey);
  if(decryption.status === 'success'){
    return JSON.parse(decryption.plaintext);
  }
  else {
    throw new Error('Failed to decrypt feedback');
  }

}
