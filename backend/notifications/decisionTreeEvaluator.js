import { calculateDaysSinceLastWorkout } from "../utils/helpers.js";

const evaluateDecisionTree = (userInterest, notifications) => {
  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(userInterest);

  const groupedNotifications = {};
  notifications.forEach((note) => {
    if (!groupedNotifications[note.type]) {
      groupedNotifications[note.type] = [];
    }
    groupedNotifications[note.type].push(note);
  });

  if (daysSinceLastWorkout >= 7) {
    return groupedNotifications["workout_reminder"]?.[0];
  }

  if (userInterest.activityScore < 30) {
    return groupedNotifications["motivation"]?.[0];
  }

  if (groupedNotifications["achievement"]) {
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

  if (
    topInterest.score > 70 &&
    groupedNotifications["template_recommendation"]
  ) {
    const recommendation = groupedNotifications["template_recommendation"].find(
      (n) => n.content.includes(topInterest.category)
    );

    return recommendation || groupedNotifications["template_recommendation"][0];
  }

  return groupedNotifications["progress_update"]?.[0] || notifications[0];
};

export { evaluateDecisionTree };
