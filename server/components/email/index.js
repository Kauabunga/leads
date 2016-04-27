
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../config/environment';
import _ from 'lodash';

let transporter = getTransporter();


export function sendTokenEmail({email, token}) {

  return new Promise((success, failure) => {

    console.log(`Sending token email ${email}, ${token}`);

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'bbq@feedback.com',
      to: email,
      subject: config.email.tokenSubject || 'Your BBQ token', // Subject line
      text: `Your token is: ${token}` // plaintext body
    };

    // send mail with defined transport object
    return transporter.sendMail(mailOptions, function(error, info){
      return error ? failure(error) : success(info);
    });

  });
}

export function sendFeedbackEmail({email, feedback, contact = 'empty', name = 'empty'}) {

  return new Promise((success, failure) => {

    console.log(`Sending feedback email ${email} ${feedback}`);

    let mailOptions = {
      from: config.email.systemSenderEmailAddress || 'bbq@feedback.com',
      to: config.email.endpointEmailAddress || email,
      subject: config.email.feedbackSubject || 'BBQ Feedback Received',

      text: `
      Name: ${name}
      Contact: ${contact}
      Feedback: ${feedback}
      `
    };

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
