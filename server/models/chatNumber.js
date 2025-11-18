import mongoose from 'mongoose';

const chatNumberSchema = mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    messages: [{
      text: String,
      isBot: Boolean,
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ChatNumber = mongoose.model('ChatNumber', chatNumberSchema);

export default ChatNumber;