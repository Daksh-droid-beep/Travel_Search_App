import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userQuestion: {
      type: String,
      required: [true, 'Please add the user question'],
      trim: true,
    },
    aiResponse: {
      type: String,
      required: [true, 'Please add the AI response'],
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    sessionId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for fast, descending timestamp sorted queries scoped by user
chatHistorySchema.index({ userId: 1, createdAt: -1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
