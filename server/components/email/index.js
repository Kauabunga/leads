
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../config/environment';
import _ from 'lodash';

let transporter = getTransporter();


export function sendTokenEmail({email, token}) {

  return new Promise((success, failure) => {

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: email,
      subject: config.email.tokenSubject || 'Leads login token', // Subject line
      text: `Your token is: ${token}` // plaintext body
    };

    console.log(`Sending token email ${email}, ${token}`, mailOptions);

    // send mail with defined transport object
    return transporter.sendMail(mailOptions, function(error, info){
      return error ? failure(error) : success(info);
    });

  });
}

export function sendLeadsEmail(leadObject) {

  return new Promise((success, failure) => {

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: config.email.endpointEmailAddress || leadObject.email,
      subject: config.email.feedbackSubject || 'New Solnet Lead Received',

      text: `Contact name: ${leadObject.contactName}
      Company name: ${leadObject.companyName}
      
      ${leadObject.contactEmail ? `Contact email: ${leadObject.contactEmail}` : ''}
      ${leadObject.contactMobile ? `Contact mobile: ${leadObject.contactMobile}` : ''}
      ${leadObject.contactPhone ? `Contact phone: ${leadObject.contactPhone}` : ''}
      
      Lead details: ${leadObject.leadDetails}`
    };


    console.log(`Sending leads email ${leadObject.email} ${leadObject.leadDetails}`, mailOptions);

    // send mail with defined transport object
    return transporter.sendMail(mailOptions, function(error, info){
      return error ? failure(error) : success(info);
    });

  });
}



/**
 * Note: using default transporter for development environments
 *
 * @returns {*}
 */
function getTransporter(){
  return nodemailer.createTransport(sgTransport(getSendgridNodemailerOptions()))
}

/**
 *
 * @returns {{connectionTimeout: number, greetingTimeout: number, socketTimeout: number}}
 */
function getNodemailerOptions(){
  return {
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  };
}

/**
 *
 * @returns {*}
 */
function getSendgridNodemailerOptions(){
  return _.merge(getNodemailerOptions(), { auth: { api_key: config.sendgridApiKey } });
}
