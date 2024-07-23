import { prisma } from "../utils/helpers.js";
import { calculateNetVotes } from "./templateStatisticsController.js";
import { getPublicTemplates } from "./workoutTemplatesController.js";
import { getUserExerciseHistory } from "./userStatistics.js";
import { getTopCategories } from "../notifications/userInterestTracker.js";

const weights = {
  copyCount: 0.5,
  netVotes: 0.3,
  creatorFollowers: 0.2,
};

let cachedMaxValues = null;
let cachedPublicTemplates = null;
const cacheDuration = 5 * 60 * 1000; // 5 minutes
const fullDayInMs = 24 * 60 * 60 * 1000;

const getPublicTemplatesWithCache = async () => {
  if (
    cachedPublicTemplates &&
    Date.now() - cachedPublicTemplates.timestamp < cacheDuration
  ) {
    return cachedPublicTemplates.templates;
  }
  const templates = await getPublicTemplates();
  cachedPublicTemplates = { templates, timestamp: Date.now() };
  return templates;
};

const getMaxValuesWithCache = async (templates) => {
  if (
    cachedMaxValues &&
    Date.now() - cachedMaxValues.timestamp < cacheDuration
  ) {
    return cachedMaxValues.values;
  }
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
  if (template.createdAt > new Date(Date.now() - fullDayInMs)) {
    score += newTemplateBoost;
  }

  return Math.min(score, 1);
};

const calculateTimeDecay = (createdAt) => {
  const templateAgeInDays =
    (Date.now() - new Date(createdAt).getTime()) / fullDayInMs;
  return 1 / (1 + Math.log(1 + templateAgeInDays) * 0.2);
};

const calculatePersonalizationFactor = async (template, userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { following: true },
  });

  const topCategories = await getTopCategories(userId, 5);

  // Check if user follows the template creator
  const userFollowsFactor = user.following.some(
    (followObject) => followObject.followingId === template.userId
  )
    ? 1.2
    : 1;

  // Calculate exercise similarity based on top categories
  const templateExercises = template.exercises.map(
    (exercise) => exercise.exercise.name
  );
  const commonExercises = templateExercises.filter((exercise) =>
    topCategories.includes(exercise)
  );

  const similarityFactor =
    1 +
    (commonExercises.length /
      Math.min(templateExercises.length, topCategories.length)) *
      0.2;

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Invalid page or limit value" });
    }

    const templates = await getPublicTemplatesWithCache();
    const maxValues = await getMaxValuesWithCache(templates);

    const scoredTemplates = await Promise.all(
      templates.map(async (template) => ({
        ...template,
        score: await calculateFinalScore(template, maxValues, userId),
      }))
    );

    const sortedTemplates = scoredTemplates.sort((a, b) => b.score - a.score);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Check if the startIndex is within the valid range
    if (startIndex >= sortedTemplates.length) {
      return res
        .status(400)
        .json({ error: "Page number exceeds available templates" });
    }

    const paginatedTemplates = sortedTemplates.slice(startIndex, endIndex);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(sortedTemplates.length / limit),
      recommendations: paginatedTemplates,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

export { getRecommendations };
