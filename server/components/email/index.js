
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../../config/environment';
import _ from 'lodash';

let transporter = getTransporter();


export function sendTokenEmail({email, token}) {

  return new Promise((success, failure) => {

    console.log(`Sending token email ${email}, ${token}`);

    let mailOptions = {
      from: 'bbq@feedback.com', // sender address
      to: email, // list of receivers
      subject: 'Your BBQ token', // Subject line
      //html: ''
      text: `Your token is: ${token}` // plaintext body
    };

    // send mail with defined transport object
    return transporter.sendMail(mailOptions, function(error, info){
      return error ? failure(error) : success(info);
    });

  });
}

export function sendFeedbackEmail({email, feedback, contact, name}) {

  return new Promise((success, failure) => {

    console.log(`Sending feedback email ${email} ${feedback}`);

    let mailOptions = {
      from: 'bbq@feedback.com', // sender address
      to: email, // list of receivers
      subject: 'BBQ Feedback Received', // Subject line
      //html: ''
      text: `
      Name: ${name}
      Contact: ${contact}
      Feedback: ${feedback}
      ` // plaintext body
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
