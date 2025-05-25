const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  encryptedData: {
    type: String,
    required: true,
  },
  assignedAgents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'inTransit', 'delivered', 'failed'],
    default: 'pending',
  },
  trackingNumber: {
    type: String,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Package', PackageSchema);
