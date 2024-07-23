import { calculateDaysSinceLastWorkout } from "../utils/helpers.js";

const evaluateDecisionTree = (userInterest, notifications) => {
  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(userInterest);

  const groupedNotifications = {};
  notifications.forEach((notif) => {
    if (!groupedNotifications[notif.type]) {
      groupedNotifications[notif.type] = [];
    }
    groupedNotifications[notif.type].push(notif);
  });

  if (daysSinceLastWorkout >= 7) {
    return groupedNotifications["workout_reminder"]?.[0];
  }

  if (userInterest.activityScore < 30) {
    return groupedNotifications["motivation"]?.[0];
  }

  if (userInterest.activityScore >= 70 && groupedNotifications["achievement"]) {
    return groupedNotifications["achievement"][0];
  }

  if (groupedNotifications["social_interaction"]) {
    return groupedNotifications["social_interaction"][0];
  }

  let topInterest = { score: 0 };
  user.interests.forEach((interest) => {
    if (interest.score > topInterest.score) {
      topInterest = interest;
    }
  });

  // Check if the user has a high interest score and try to find a template matching the user's top interest category
  if (
    topInterest.score > 70 &&
    groupedNotifications["template_recommendation"]
  ) {
    // Find a recommendation that matches the user's top interest category
    const recommendation = groupedNotifications["template_recommendation"].find(
      (n) => n.content.includes(topInterest.category)
    );

    // Return the matching recommendation or fallback to the first template recommendation
    return recommendation || groupedNotifications["template_recommendation"][0];
  }

  // If no specific notification is selected, return a progress update
  return groupedNotifications["progress_update"]?.[0] || notifications[0];
};

export { evaluateDecisionTree };
