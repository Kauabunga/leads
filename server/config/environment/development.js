'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/leads-dev'
  },

  // Seed database on startup
  seedDB: true,

  validEmailDomains: 'gmail.com, solnet.co.nz, solnetsolutions.co.nz',

  email: {
    endpointEmailAddress: '',
    attachSenderEmailAddress: true
  },

  encyptionPassPhrase: 'The Moon is a Harsh Mistress.',


  disableLeadEmail: false,
  disableLeadOdoo: false

};
