import ChatNumber from '../models/chatNumber.js';

export const createChatNumber = async (req, res) => {
  try {
    const { sessionId, name, mobile, email, messages, status } = req.body;
    
    let chatNumber = await ChatNumber.findOne({ sessionId });
      
      if (chatNumber) {
        // Update existing conversation
        chatNumber.name = name || chatNumber.name;
        chatNumber.mobile = mobile || chatNumber.mobile;
        chatNumber.email = email || chatNumber.email;
        chatNumber.messages = messages || chatNumber.messages;
        chatNumber.status = status || chatNumber.status;
      } else {
        // Create new conversation
        chatNumber = new ChatNumber({
          sessionId,
          name: name || '',
          mobile: mobile || '',
          email: email || '',
          messages: messages || [],
          status: status || 'active'
        });
      }
      
      await chatNumber.save();
      res.status(201).json({ message: 'Conversation saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving conversation', error: error.message });
  }
};

export const getChatNumbers = async (req, res) => {
  try {
    const chatNumbers = await ChatNumber.find().sort({ createdAt: -1 });
    res.json(chatNumbers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

export const deleteChatNumber = async (req, res) => {
  try {
    await ChatNumber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting conversation', error: error.message });
  }
};