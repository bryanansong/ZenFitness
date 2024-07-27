import { prisma } from "./helpers.js";

export const getOrCreateChat = async (userId1, userId2) => {
  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId1 } } },
        { participants: { some: { id: userId2 } } },
      ],
    },
  });

  if (existingChat) {
    return existingChat;
  }

  const newChat = await prisma.chat.create({
    data: {
      participants: {
        connect: [{ id: userId1 }, { id: userId2 }],
      },
    },
  });

  return newChat;
};
