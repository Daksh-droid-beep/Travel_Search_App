import SearchHistory from '../models/SearchHistory.js';

// @desc    Get user search history
// @route   GET /api/history
// @access  Private
export const getSearchHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error('Fetch History Error:', error);
    res.status(500).json({ message: 'Server error while fetching search history' });
  }
};

// @desc    Delete a search history item
// @route   DELETE /api/history/:id
// @access  Private
export const deleteHistoryItem = async (req, res) => {
  try {
    const historyItem = await SearchHistory.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({ message: 'History item not found' });
    }

    // Verify history item belongs to the logged-in user
    if (historyItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await historyItem.deleteOne();

    res.json({ message: 'History item removed' });
  } catch (error) {
    console.error('Delete History Error:', error);
    res.status(500).json({ message: 'Server error while deleting history item' });
  }
};
