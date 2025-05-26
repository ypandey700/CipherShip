const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  packageId: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,  // index to optimize queries by customer
  },
  encryptedData: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String, // base64 string or a URL path
    required: true,
  },  
  assignedAgents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,  // index individual assigned agents for queries
    }
  ],
  deliveryStatus: {
    type: String,
    enum: ['pending', 'inTransit', 'delivered', 'failed'],
    default: 'pending',
  },
  trackingNumber: {
    type: String,
    // You can add validation here, e.g.,
    // validate: {
    //   validator: v => /^[A-Z0-9\-]+$/.test(v),
    //   message: props => `${props.value} is not a valid tracking number!`
    // }
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Package', PackageSchema);
