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

export { getChats, getMessages, createMessage };
