
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../config/environment';
import _ from 'lodash';
import fs from 'fs';
import inlineCss from 'inline-css';

let transporter = getTransporter();

let loginTokenTemplate = fs.readFileSync(`${__dirname}/login-token.template.html`, 'utf8');
let inlinedTemplate = inlineCss(loginTokenTemplate, {url: '/'});


export function sendTokenEmail({baseUrl, email, token}) {

  return inlinedTemplate.then((template) => {
    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: email,
      subject: config.email.tokenSubject || 'Solnet Leads login', // Subject line
      html: template.replace('{{{token}}}', token)
        .replace('{{{tokenUrl}}}', getTokenUrl(baseUrl, email, token))
    };

    console.log(`Sending token email ${email}, ${token}`, mailOptions);

    // send mail with defined transport object
    return new Promise((success, failure) => {
      return transporter.sendMail(mailOptions, function(error, info){
        return error ? failure(error) : success(info);
      });
    })
  });
}

function getTokenUrl(baseUrl, email, token){
  return `${baseUrl}/#/token/${email}/${token}`;
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
