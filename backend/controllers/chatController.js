import ChatHistory from '../models/ChatHistory.js';

// @desc    Get all chat history for the logged-in user
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user chat history sorted by newest first, limited to 50 records for pagination/performance
    const history = await ChatHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ message: 'Server error retrieving chat history' });
  }
};

// @desc    Get a specific chat conversation by ID
// @route   GET /api/chat/history/:id
// @access  Private
export const getChatConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chat = await ChatHistory.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat conversation not found or unauthorized' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get Chat Conversation Error:', error);
    res.status(500).json({ message: 'Server error retrieving conversation' });
  }
};

// @desc    Delete a specific chat conversation
// @route   DELETE /api/chat/history/:id
// @access  Private
export const deleteChatEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chat = await ChatHistory.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat conversation not found or unauthorized' });
    }

    await chat.deleteOne();

    res.json({ message: 'Chat conversation deleted successfully', id });
  } catch (error) {
    console.error('Delete Chat Entry Error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};

// @desc    Clear all chat history for the logged-in user
// @route   DELETE /api/chat/history
// @access  Private
export const clearAllChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await ChatHistory.deleteMany({ userId });

    res.json({ message: 'All chat history cleared successfully' });
  } catch (error) {
    console.error('Clear All Chat History Error:', error);
    res.status(500).json({ message: 'Server error clearing chat history' });
  }
};
