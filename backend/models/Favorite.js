import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
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
      type: Object,
      required: true,
    },
    destinationName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    coordinates: {
      type: Object,
      default: null,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index to ensure a user cannot bookmark the same query twice
favoriteSchema.index({ userId: 1, query: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
