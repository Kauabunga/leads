
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../config/environment';
import _ from 'lodash';
import fs from 'fs';
import inlineCss from 'inline-css';

let transporter = getTransporter();

let OODO_URL = config.odooViewLeadUrl || 'https://solnet.odooplus.nz/';

let loginTokenTemplate = fs.readFileSync(`${__dirname}/login-token.template.html`, 'utf8');
let inlinedLoginTemplate = inlineCss(loginTokenTemplate, {url: '/'});

let leadCreatedSalesTemplate = fs.readFileSync(`${__dirname}/lead-created-sales.template.html`, 'utf8');
let inlinedSalesTemplate = inlineCss(leadCreatedSalesTemplate, {url: '/'});

let leadCreatedUserTemplate = fs.readFileSync(`${__dirname}/lead-created-user.template.html`, 'utf8');
let inlinedUserTemplate = inlineCss(leadCreatedUserTemplate, {url: '/'});


export function sendTokenEmail({baseUrl, email, token, uuid}) {

  return inlinedLoginTemplate.then((template) => {
    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: email,
      subject: config.email.tokenSubject || 'Solnet Leads login', // Subject line
      html: template.replace('{{{token}}}', token)
        .replace('{{{tokenUrl}}}', getTokenUrl(baseUrl, uuid))
    };

    console.log(`Sending token email ${email}, ${token}`, mailOptions);

    // send mail with defined transport object
    return new Promise((success, failure) => {
      return transporter.sendMail(mailOptions, function(error, info){
        return error ? failure(error) : success(info);
      });
    });
  });
}

function getTokenUrl(baseUrl, uuid){
  return `${baseUrl}/#/token/${uuid}`;
}

export function sendLeadsEmail(leadObject) {
  return Promise.all([
    sendLeadsSalesEmail(leadObject),
    sendLeadsUserEmail(leadObject)
  ]);
}


function sendLeadsSalesEmail(leadObject){

  return inlinedSalesTemplate.then((template) => {

    if (!config.email.endpointEmailAddress) { return; }

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: config.email.endpointEmailAddress,
      subject: config.email.feedbackSubject || 'New Solnet Lead Received',
      html: template.replace('{{{leadUrl}}}', OODO_URL)
        .replace('{{{contactName}}}', leadObject.contactName)
        .replace('{{{companyName}}}', leadObject.companyName)
    };


    console.log(`Sending leads sale email ${leadObject.email} ${leadObject.leadDetails}`, mailOptions);

    // send mail with defined transport object
    return new Promise((success, failure) => {
      return transporter.sendMail(mailOptions, function (error, info) {
        return error ? failure(error) : success(info);
      });
    });
  });

}


function sendLeadsUserEmail(leadObject){

  return inlinedUserTemplate.then((template) => {

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'leads@solnet.co.nz',
      to: leadObject.email,
      subject: config.email.feedbackSubject || 'Confirmation of your submitted lead',

      html: template.replace('{{{leadUrl}}}', OODO_URL)
        .replace('{{{contactName}}}', leadObject.contactName)
        .replace('{{{companyName}}}', leadObject.companyName)

    };

    console.log(`Sending leads user email ${leadObject.email} ${leadObject.leadDetails}`, mailOptions);

    // send mail with defined transport object
    return new Promise((success, failure) => {
      return transporter.sendMail(mailOptions, function(error, info){
        return error ? failure(error) : success(info);
      });
    });

  })

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
