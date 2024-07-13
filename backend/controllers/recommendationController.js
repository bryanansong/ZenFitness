import { prisma } from "../utils/helpers.js";
import { calculateNetVotes } from "./templateStatisticsController.js";
import { getPublicTemplates } from "./workoutTemplatesController.js";
import { getUserExerciseHistory } from "./userStatistics.js"; // Assume this function exists

/*
1. Calculate the base score for each template.
2. Apply the time decay function to account for recency.
3. Incorporate personalization factors to tailor the recommendations.
4. Sort the templates based on their final scores and return top results.
TODO: Set the userId from the http request
*/

const templates = await getPublicTemplates();
let userId = 1; // TODO: Replace this with the userId from the req attributes in the http request

const fullDayInms = 24 * 60 * 60 * 1000;

const weights = {
  copyCount: 0.6,
  netVotes: 0.25,
  creatorFollowers: 0.15,
};

// Helper methods
const normalizeValue = (value, max) => (max > 0 ? value / max : 0);
const normalizeVotes = (votes, maxAbsVotes) =>
  (votes + maxAbsVotes) / (2 * maxAbsVotes);

// Get max values for normalization
const getMaxValues = async () => {
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
const calculateBaseScore = (template, maxValues) => {
  const netVotes = calculateNetVotes(template);
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
  if (template.createdAt > new Date(Date.now() - fullDayInms)) {
    score += newTemplateBoost;
  }

  return Math.min(score, 1);
};

const calculateTimeDecay = (createdAt) => {
  const templateAgeInDays =
    (Date.now() - new Date(createdAt).getTime()) / fullDayInms;
  return 1 / (1 + Math.log(1 + templateAgeInDays) * 0.2);
};
