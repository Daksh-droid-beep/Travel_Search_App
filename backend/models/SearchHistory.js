import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      overview: { type: String, required: true },
      bestTime: { type: String, required: true },
      attractions: [{ type: String }],
      estimatedBudget: {
        backpacker: { type: String },
        midRange: { type: String },
        luxury: { type: String },
      },
    },
  },
  {
    timestamps: true,
  }
);

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
