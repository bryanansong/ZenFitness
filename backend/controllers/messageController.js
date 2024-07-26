import { prisma } from "../utils/helpers.js";

const getChats = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          where: {
            id: {
              not: userId,
            },
          },
        },
        messages: {
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
    });

    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      otherUser: chat.participants[0],
      lastMessage: chat.messages[0]?.content || "",
    }));

    res.json(formattedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const chatId = parseInt(req.params.chatId);

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.some((p) => p.id === userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this chat" });
    }

    const otherUser = chat.participants.find((p) => p.id !== userId);

    res.json({
      messages: chat.messages,
      otherUser: {
        id: otherUser.id,
        username: otherUser.username,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.userId;

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        chatId,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
};

const getOrCreateChat = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const otherUserId = parseInt(req.params.userId);

    // Check if users are mutually following each other
    const mutualFollow = await prisma.follow.findMany({
      where: {
        OR: [
          { followerId: currentUserId, followingId: otherUserId },
          { followerId: otherUserId, followingId: currentUserId },
        ],
      },
    });

    if (mutualFollow.length !== 2) {
      return res
        .status(403)
        .json({
          error: "Users must be mutually following each other to start a chat",
        });
    }

    // Check if a chat already exists between these users
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { id: currentUserId } } },
          { participants: { some: { id: otherUserId } } },
        ],
      },
    });

    if (existingChat) {
      return res.json({ chatId: existingChat.id });
    }

    // If no chat exists, create a new one
    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [{ id: currentUserId }, { id: otherUserId }],
        },
      },
    });

    res.json({ chatId: newChat.id });
  } catch (error) {
    console.error("Error creating/retrieving chat:", error);
    res.status(500).json({ error: "Failed to create/retrieve chat" });
  }
};


export { getChats, getMessages, createMessage, getOrCreateChat };
