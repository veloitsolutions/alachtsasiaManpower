import mongoose from 'mongoose';

const WorkerAnalyticsSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['CLIENT', 'ADMIN', 'GUEST'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Manpower', 
    required: true
  },
  actionType: {
    type: String,
    enum: ['VIEW', 'CALL', 'SHARE', 'WHATSAPP', 'DOWNLOAD_RESUME'],
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better query performance
WorkerAnalyticsSchema.index({ workerId: 1, actionType: 1 });
WorkerAnalyticsSchema.index({ timestamp: -1 });

const WorkerAnalytics = mongoose.model('WorkerAnalytics', WorkerAnalyticsSchema);

export default WorkerAnalytics;
