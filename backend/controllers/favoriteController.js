import Favorite from '../models/Favorite.js';

// @desc    Add a destination to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { query, result } = req.body;
    const userId = req.user.id; // set by authMiddleware

    if (!query || !result) {
      return res.status(400).json({ message: 'Query and result details are required' });
    }

    // Check if already bookmarked
    const existing = await Favorite.findOne({ userId, query });
    if (existing) {
      return res.status(400).json({ message: 'Destination is already saved in favorites' });
    }

    const favorite = await Favorite.create({
      userId,
      query,
      result,
    });

    res.status(201).json({
      message: 'Destination saved to bookmarks successfully',
      favorite,
    });
  } catch (error) {
    console.error('Add Favorite Error:', error);
    res.status(500).json({ message: 'Server error saving to bookmarks' });
  }
};

// @desc    Get all favorites for the logged-in user
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get favorites sorted by newest first
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({ message: 'Server error retrieving bookmarks' });
  }
};

// @desc    Remove a destination from favorites by ID or Query string
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let favorite;
    
    // Check if the id parameter is a valid MongoDB ObjectId or a query string
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      favorite = await Favorite.findOne({ _id: id, userId });
    } else {
      // It's a query string (e.g. "Paris")
      favorite = await Favorite.findOne({ query: id, userId });
    }

    if (!favorite) {
      return res.status(404).json({ message: 'Bookmark not found or unauthorized' });
    }

    await favorite.deleteOne();

    res.json({ message: 'Bookmark removed successfully', query: favorite.query });
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    res.status(500).json({ message: 'Server error removing bookmark' });
  }
};
