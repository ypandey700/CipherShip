const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    validate: {
      validator: v => emailRegex.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'deliveryAgent', 'customer'], 
    default: 'customer', 
    index: true  // index role for queries by user role
  },
}, {
  timestamps: true,  // createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
