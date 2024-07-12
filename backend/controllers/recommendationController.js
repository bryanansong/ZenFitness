import { prisma } from "../utils/helpers.js";
import { calculateNetVotes } from "./templateStatisticsController.js";
import { getPublicTemplates } from "./workoutTemplatesController.js";

/*
1. Calculate the base score for each template.
2. Apply the time decay function to account for recency.
3. Incorporate personalization factors to tailor the recommendations.
4. Sort the templates based on their final scores and return top results.
*/

// Get max values for normalization
const getMaxValues = async () => {
  const templates = await getPublicTemplates();

  let maxNetVotes = 0;
  let maxCopyCount = 0;
  let maxFollowerCount = 0;

  templates.forEach((template) => {
    const netVotes = calculateNetVotes(template);
    maxNetVotes = Math.max(maxNetVotes, Math.abs(netVotes));
    maxCopyCount = Math.max(maxCopyCount, template.copyCount);
    maxFollowerCount = Math.max(
      maxFollowerCount,
      template.user.followers.length
    );
  });

  return { maxNetVotes, maxCopyCount, maxFollowerCount };
};
