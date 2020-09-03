const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    delete_password: { type: String, required: true, trim: true },
    reported: { type: Boolean, default: false },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'bumped_on' } }
);

module.exports = mongoose.model('Thread', threadSchema);
