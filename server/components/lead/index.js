
import config from '../../config/environment';
import _ from 'lodash';
import cryptico from 'cryptico';
import * as emailService from '../email';
import request from 'request-promise';

// The passphrase used to repeatably generate this RSA key.
// If this changes then all existing encrypted forms to sync are stuffed
const passPhrase = config.encyptionPassPhrase;
// The length of the RSA key, in bits.

const bits = 1024;
const RSAkey = cryptico.generateRSAKey(passPhrase, bits);
const LEAD_PUBLIC_KEY_STRING = cryptico.publicKeyString(RSAkey);
const POST_URI = config.odooPostUri;
const ODOO_ACCESS_TOKEN = config.odooAccessToken;



export function sendLead(leadObject) {

  if( ! leadObject || ! leadObject.leadDetails){
    return Promise.reject(new Error('No lead passed to sendLead'));
  }

  if( ! leadObject.anonymous ){
    leadObject.leadDetails = `Lead created by ${leadObject.email}

    ${leadObject.leadDetails}`;
  }

  let resolves = [];

  if( ! config.disableLeadEmail ){
    resolves.push(emailService.sendLeadsEmail(leadObject));
  }
  if( ! config.disableLeadOdoo && ODOO_ACCESS_TOKEN ){
    resolves.push(postLead(leadObject));
  }

  return Promise.all(resolves);
}


export function sendEncryptedLead({ email, encrypted }) {

  if(! encrypted){
    return Promise.reject(new Error('No encrypted feedback passed to send encrypted feedback'));
  }

  return sendLead(_.merge({email}, decryptLead({ encrypted })));
}


export function getLeadPublicKey() {
  return Promise.resolve({publicKey: LEAD_PUBLIC_KEY_STRING});
}

function decryptLead({ encrypted }){

  let decryption = cryptico.decrypt(encrypted, RSAkey);
  if(decryption.status === 'success'){
    return JSON.parse(decryption.plaintext);
  }
  else {
    throw new Error('Failed to decrypt lead');
  }

}

function postLead(leadObject){

  console.log('Posting lead', leadObject);

  return request({
    method: 'POST',
    uri: POST_URI,
    form: {
      access_token: ODOO_ACCESS_TOKEN,
      contact_name: leadObject.contactName,
      company_name: leadObject.companyName,
      contact_email: leadObject.contactEmail || 'unknown@email.com',
      contact_mobile: leadObject.contactMobile || '',
      contact_phone: leadObject.contactPhone || '',
      message: leadObject.leadDetails
    }
  })
    .then(response => {
      console.log('Post lead response', response.statusCode, response.body);
      return response;
    });
}

