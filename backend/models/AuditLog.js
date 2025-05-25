const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional user performing action
  userName: { type: String }, // optional redundant username/email for logs
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true }, // package related to the action
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // delivery agent performing action
  action: { 
    type: String, 
    enum: ['status_update', 'scan', 'other'], // add 'other' or any other action types as needed
    required: true 
  },
  details: { type: String }, // optional description (changed from detail to details for consistency)
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
