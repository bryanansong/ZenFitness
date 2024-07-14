import { prisma } from "../utils/helpers.js";
import { calculateNetVotes } from "./templateStatisticsController.js";
import { getPublicTemplates } from "./workoutTemplatesController.js";
import { getUserExerciseHistory } from "./userStatistics.js";

const fullDayInms = 24 * 60 * 60 * 1000;

const weights = {
  copyCount: 0.5,
  netVotes: 0.3,
  creatorFollowers: 0.2,
};

let cachedMaxValues = null;
let cachedPublicTemplates = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getMaxValuesWithCache = async () => {
  if (
    cachedMaxValues &&
    Date.now() - cachedMaxValues.timestamp < CACHE_DURATION
  ) {
    return cachedMaxValues.values;
  }
  const templates = await getPublicTemplates();
  const maxValues = await getMaxValues(templates);
  cachedMaxValues = { values: maxValues, timestamp: Date.now() };
  return maxValues;
};

// Helper methods
const normalizeValue = (value, max) => (max > 0 ? value / max : 0);
const normalizeVotes = (votes, maxAbsVotes) =>
  (votes + maxAbsVotes) / (2 * maxAbsVotes);

// Get max values for normalization
const getMaxValues = async (templates) => {
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

const calculatePersonalizationFactor = async (template, userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { following: true },
  });

  const userExercises = await getUserExerciseHistory(userId);

  // Check if user follows the template creator
  const userFollowsFactor = user.following.some(
    (followObject) => followObject.followingId === template.userId
  )
    ? 1.2
    : 1;

  // Calculate exercise similarity
  const templateExercises = template.exercises.map(
    (exercise) => exercise.exerciseId
  );
  const commonExercises = templateExercises.filter((exercise) =>
    userExercises.includes(exercise)
  );
  const similarityFactor =
    1 + (commonExercises.length / templateExercises.length) * 0.1;

  return userFollowsFactor * similarityFactor;
};

const calculateFinalScore = async (template, maxValues, userId) => {
  const baseScore = calculateBaseScore(template, maxValues);
  const timeDecay = calculateTimeDecay(template.createdAt);
  const personalizationFactor = await calculatePersonalizationFactor(
    template,
    userId
  );
  return baseScore * timeDecay * personalizationFactor;
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const templates = await getPublicTemplates();
    const maxValues = await getMaxValues(templates);

    const scoredTemplates = await Promise.all(
      templates.map(async (template) => ({
        ...template,
        score: await calculateFinalScore(template, maxValues, userId),
      }))
    );

    const sortedTemplates = scoredTemplates.sort((a, b) => b.score - a.score);

    res.json(sortedTemplates);
    return sortedTemplates;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

export { getRecommendations };
