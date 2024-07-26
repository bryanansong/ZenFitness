import { prisma } from "../utils/helpers.js";
import { checkFollowAndCreateChat } from "./messageController.js";

const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workoutTemplates: {
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
          take: 6,
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
        workoutSessions: {
          orderBy: { date: "desc" },
          take: 10,
          include: {
            workoutTemplate: true,
            workoutSets: {
              include: {
                exercise: true,
              },
            },
          },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove sensitive information
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};

const followUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = parseInt(req.params.userId);

    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.json({ message: "User followed successfully" });
    await checkFollowAndCreateChat(followerId, followingId);
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = parseInt(req.params.userId);

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = parseInt(req.params.userId);

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({ isFollowing: follow ? true : false });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
};

export {
  getProfile,
  getCurrentUser,
  followUser,
  unfollowUser,
  getFollowStatus,
};
