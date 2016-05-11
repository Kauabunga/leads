'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGODB_URI ||
          process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mongodb://localhost/leads'
  },

  encyptionPassPhrase: process.env.ENCRYPTION_PASS_PHRASE || 'The Moon is a Harsh Mistress.',

  forceHttps: getVarAsBool('FORCE_HTTPS') || false,

  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAILS || '',
  validEmailDomains: process.env.VALID_EMAIL_DOMAINS || '',
  invalidEmailDomainMessage: process.env.INVALID_EMAIL_DOMAIN_MESSAGE || '',

  email: {
    attachSenderEmailAddress: getVarAsBool('ATTACH_SENDER_EMAIL_ADDRESS') || true,
    endpointEmailAddress: process.env.ENDPOINT_EMAIL_ADDRESS,
    systemSenderEmailAddress: process.env.SYSTEM_SENDER_EMAIL_ADDRESS,
    feedbackSubject: process.env.FEEDBACK_EMAIL_SUBJECT,
    tokenSubject: process.env.TOKEN_EMAIL_SUBJECT
  }

};


console.log(`Mongo db uri:`);
console.log(`MONGODB_URI=${process.env.MONGODB_URI}`);

console.log(`Force https:`);
console.log(`FORCE_HTTPS=${process.env.FORCE_HTTPS}`);

console.log(`Encryption pass phrase:`);
console.log(`ENCRYPTION_PASS_PHRASE=XXXXXXXX`);

console.log(`Comma delimited default admin emails:`);
console.log(`DEFAULT_ADMIN_EMAIL=${process.env.DEFAULT_ADMIN_EMAILS}`);

console.log(`Comma delimited valid email domains:`);
console.log(`VALID_EMAIL_DOMAINS=${process.env.VALID_EMAIL_DOMAINS}`);

console.log(`Invalid email domain message:`);
console.log(`INVALID_EMAIL_DOMAIN_MESSAGE=${process.env.INVALID_EMAIL_DOMAIN_MESSAGE}`);

console.log(`Endpoint email address:`);
console.log(`ENDPOINT_EMAIL_ADDRESS=${process.env.ENDPOINT_EMAIL_ADDRESS}`);

console.log(`Attach sender email address:`);
console.log(`ATTACH_SENDER_EMAIL_ADDRESS=${process.env.ATTACH_SENDER_EMAIL_ADDRESS}`);

console.log(`Attach system sender email address:`);
console.log(`SYSTEM_SENDER_EMAIL_ADDRESS=${process.env.SYSTEM_SENDER_EMAIL_ADDRESS}`);

console.log(`Feedback email subject:`);
console.log(`FEEDBACK_EMAIL_SUBJECT=${process.env.FEEDBACK_EMAIL_SUBJECT}`);

console.log(`Token email subject:`);
console.log(`TOKEN_EMAIL_SUBJECT=${process.env.TOKEN_EMAIL_SUBJECT}`);




function getVarAsBool(name){
  return process.env[name] && (process.env[name] === true || process.env[name] === 'true');
}
