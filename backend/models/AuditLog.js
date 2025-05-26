const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional user performing action
  userName: { type: String }, // optional redundant username/email for logs
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true }, // package related to the action
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // delivery agent performing action
  action: {
    type: String,
    enum: ['package_created', 'status_update', 'scan', 'other'], // add this
    required: true,
  },  
  details: { type: String }, // optional description
  timestamp: { type: Date, default: Date.now, index: true }, // index for faster time-based queries
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
