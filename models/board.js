const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
});

module.exports = mongoose.model('Board', boardSchema);
