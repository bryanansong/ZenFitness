import { prisma } from "../utils/helpers.js";
import { calculateNetVotes } from "./templateStatisticsController.js";
import { getPublicTemplates } from "./workoutTemplatesController.js";

/*
1. Calculate the base score for each template.
2. Apply the time decay function to account for recency.
3. Incorporate personalization factors to tailor the recommendations.
4. Sort the templates based on their final scores and return top results.
*/

// Constants
const weights = {
  copyCount: 0.6,
  netVotes: 0.25,
  creatorFollowers: 0.15,
};

// Helper methods
const normalizeValue = (value, max) => {
  return max > 0 ? value / max : 0;
};

const normalizeVotes = (netVotes, maxAbsNetVotes) => {
  return (netVotes + maxAbsNetVotes) / (2 * maxAbsNetVotes);
};

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

// Calculate base score for a workout template
const calculateBaseScore = async (template, maxValues) => {
  const netVotes = calculateNetVotes(template.votes);
  const followerCount = template.user.followers.length;

  const normalizedNetVotes = normalizeVotes(netVotes, maxValues.maxNetVotes);
  const normalizedCopyCount = normalizeValue(
    template.copyCount,
    maxValues.maxCopyCount
  );
  const normalizedFollowerCount = normalizeValue(
    followerCount,
    maxValues.maxFollowerCount
  );

  let score =
    weights.netVotes * normalizedNetVotes +
    weights.copyCount * normalizedCopyCount +
    weights.creatorFollowers * normalizedFollowerCount;

  // Boost for new templates
  const newTemplateBoost = 0.1;
  if (template.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    score += newTemplateBoost;
  }

  return Math.min(score, 1);
};
