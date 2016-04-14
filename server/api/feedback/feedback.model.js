'use strict';

import mongoose from 'mongoose';

var FeedbackSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Feedback', FeedbackSchema);
