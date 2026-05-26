const mongoose = require('mongoose');

const lifecycleVerificationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  apaarId: {
    type: String,
    required: true
  },
  changeType: {
    type: String,
    enum: ['add', 'update', 'delete'],
    required: true
  },
  stageData: {
    stageName: String,
    startDate: Date,
    endDate: Date,
    status: String,
    description: String,
    documents: [String]
  },
  previousData: {
    type: Object,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminComment: String,
  reviewedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LifecycleVerification', lifecycleVerificationSchema);