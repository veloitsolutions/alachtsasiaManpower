import ChatNumber from '../models/chatNumber.js';

// @desc    Create or update chat conversation
// @route   POST /api/chat-numbers
// @access  Public
const createOrUpdateChatNumber = async (req, res) => {
  try {
    const { sessionId, name, mobile, email, messages, status } = req.body;

    // Check if chat session already exists
    let chatNumber = await ChatNumber.findOne({ sessionId });

    if (chatNumber) {
      // Update existing chat
      chatNumber.name = name || chatNumber.name;
      chatNumber.mobile = mobile || chatNumber.mobile;
      chatNumber.email = email || chatNumber.email;
      chatNumber.messages = messages || chatNumber.messages;
      chatNumber.status = status || chatNumber.status;
      
      await chatNumber.save();
    } else {
      // Create new chat
      chatNumber = await ChatNumber.create({
        sessionId,
        name,
        mobile,
        email,
        messages,
        status
      });
    }

    res.status(201).json({
      success: true,
      data: chatNumber
    });
  } catch (error) {
    console.error('Error creating/updating chat number:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all chat conversations
// @route   GET /api/chat-numbers
// @access  Private (Admin)
const getChatNumbers = async (req, res) => {
  try {
    const chatNumbers = await ChatNumber.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: chatNumbers.length,
      data: chatNumbers
    });
  } catch (error) {
    console.error('Error fetching chat numbers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single chat conversation
// @route   GET /api/chat-numbers/:id
// @access  Private (Admin)
const getChatNumber = async (req, res) => {
  try {
    const chatNumber = await ChatNumber.findById(req.params.id);

    if (!chatNumber) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chatNumber
    });
  } catch (error) {
    console.error('Error fetching chat number:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark chat as read
// @route   PUT /api/chat-numbers/:id/read
// @access  Private (Admin)
const markChatAsRead = async (req, res) => {
  try {
    const chatNumber = await ChatNumber.findById(req.params.id);

    if (!chatNumber) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found'
      });
    }

    chatNumber.isRead = true;
    await chatNumber.save();

    res.status(200).json({
      success: true,
      data: chatNumber
    });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete chat conversation
// @route   DELETE /api/chat-numbers/:id
// @access  Private (Admin)
const deleteChatNumber = async (req, res) => {
  try {
    const chatNumber = await ChatNumber.findById(req.params.id);

    if (!chatNumber) {
      return res.status(404).json({
        success: false,
        message: 'Chat conversation not found'
      });
    }

    await ChatNumber.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Chat conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat number:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export {
  createOrUpdateChatNumber,
  getChatNumbers,
  getChatNumber,
  markChatAsRead,
  deleteChatNumber
};