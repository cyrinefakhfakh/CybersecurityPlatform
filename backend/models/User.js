const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
        return this.verified; // Only required after verification
    },
},
password: {
    type: String,
    required: function () {
        return this.verified; // Only required after verification
    },
},
email: {
    type: String,
    required: true,
    unique: true,
},
  role: {
    type: String,
    required: true,
    default: 'user', // Default role is 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verificationCode: {
    type: String
  },
  verificationCodeExpires: {
    type: Date
  },
  enrolledCourses: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    default: []  // Ensure default is an empty array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;