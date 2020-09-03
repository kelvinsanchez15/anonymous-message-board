const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  delete_password: { type: String, required: true, trim: true },
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reply', replySchema);

// saved _id, text, created_on, delete_password, & reported.
