'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/leads-test'
  },

  email: {
    endpointEmailAddress: '',
    attachSenderEmailAddress: true
  },

  encyptionPassPhrase: 'The Moon is a Harsh Mistress.'

};
