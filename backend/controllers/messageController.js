const Message = require("../models/Message");
const Interest = require("../models/Interest");

// Save a message
const sendMessage = async (req, res) => {
  try {
    const { receiver, listing, message } = req.body;

    // Check if chat is allowed
    const interest = await Interest.findOne({
      listing,
      status: "Accepted",
      $or: [
        {
          tenant: req.user._id,
          owner: receiver,
        },
        {
          tenant: receiver,
          owner: req.user._id,
        },
      ],
    });

    if (!interest) {
      return res.status(403).json({
        success: false,
        message:
          "Chat is available only after the owner accepts the interest request.",
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      listing,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: newMessage,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get conversation between two users for a listing
const getMessages = async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    const messages = await Message.find({
      listing: listingId,
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};