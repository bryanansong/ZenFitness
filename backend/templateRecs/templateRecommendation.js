import { calculateBaseScore } from "../controllers/recommendationController.js";
import { prisma } from "../utils/helpers.js";

const calculateLocality = async (userId, creatorId) => {
  const maxDepth = 2;
  const visited = new Set();
  const queue = [[userId, 0]];
  let mutualFollowers = 0;

  // Breadth first search approach to finding second degree connections
  while (queue.length > 0) {
    const [currentUserId, depth] = queue.shift();

    if (depth > maxDepth) break;

    if (visited.has(currentUserId)) continue;
    visited.add(currentUserId);

    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        following: {
          include: {
            following: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!user) continue;

    for (const followingRelation of user.following) {
      const followingUser = followingRelation.following;

      if (followingUser.id === creatorId) {
        mutualFollowers++;
      }

      if (depth < maxDepth && !visited.has(followingUser.id)) {
        queue.push([followingUser.id, depth + 1]);
      }
    }
  }

  return mutualFollowers;
};

const getTemplateRecommendationScore = async (template, userId, maxValues) => {
  const baseScore = calculateBaseScore(template, maxValues);
  const mutualFollowers = await calculateLocality(userId, template.user.id);

  // Normalize mutual followers
  const maxMutualFollowers = maxValues.maxFollowerCount;
  const normalizedMutualFollowers = Math.min(
    mutualFollowers / maxMutualFollowers,
    1
  );

  // Calculate final score (adjust weights as needed)
  const score = baseScore + normalizedMutualFollowers;

  return score;
};

export { getTemplateRecommendationScore };
