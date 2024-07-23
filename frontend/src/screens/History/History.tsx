import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import WorkoutHeatmap from "../../components/WorkoutHeatmap/WorkoutHeatmap";
import styles from "./History.module.css";

const History = () => {
  const [totalTimeWorkingout, setTotalTimeWorkingout] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [favoriteExercise, setFavoriteExercise] = useState("...");
  const [streak, setStreak] = useState(0);
  const [pastSessions, setPastSessions] = useState<WorkoutSession[]>([]);

  const fetchWorkoutStatistics = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user-statistics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch workout statistics"
        );
      }

      const stats = await response.json();
      setTotalTimeWorkingout(stats.totalTimeWorkingout);
      setTotalWorkouts(stats.totalWorkouts);
      setFavoriteExercise(stats.favoriteExercise);
      setStreak(stats.streak);
    } catch (error) {
      console.error("Error fetching workout statistics:", error);
      throw error;
    }
  };

  const fetchPastSessions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-sessions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workout sessions");
      }
      const data = await response.json();
      setPastSessions(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchWorkoutStatistics();
    fetchPastSessions();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <p className={styles.pageTitle}>Workout Activity</p>
        <WorkoutHeatmap />
        <p className={styles.pageTitle}>Overview</p>
        <div className={styles.overviewTiles}>
          <div className={styles.overviewSide}>
            <div className={`${styles.tile} ${styles.overviewLeft}`}>
              <p className={styles.workoutsNumber}>{totalWorkouts}</p>
              <p className={styles.tileHeroText}>Workouts performed so far</p>
            </div>
          </div>
          <div className={styles.overviewSide}>
            <div className={styles.overviewUpper}>
              <div className={`${styles.tile} ${styles.timeTile}`}>
                <p className={styles.timeTileHours}>
                  {Math.round(totalTimeWorkingout / 60).toLocaleString()}
                </p>
                <p className={styles.timeTileText}>
                  {Math.round(totalTimeWorkingout / 60) === 1
                    ? "Minute"
                    : "Total mins"}{" "}
                  spent working out
                </p>
              </div>
              <div className={styles.tile}>
                <p className={styles.tileText}>
                  {favoriteExercise.replaceAll("_", " ")} is your favorite
                  exercise
                </p>
              </div>
            </div>
            <div className={`${styles.tile} ${styles.overviewBottom}`}>
              <div className={`${styles.streakTile} ${styles.streakLeft}`}>
                You've logged workouts
              </div>
              <div className={`${styles.streakTile} ${styles.streakMid}`}>
                {streak}
              </div>
              <div className={`${styles.streakTile} ${styles.streakRight}`}>
                day{streak === 1 ? "" : "s"} in a row!
              </div>
            </div>
          </div>
        </div>
        <p className={styles.pageTitle}>Past workout sessions</p>
        <div className={styles.pastSessions}>
          {pastSessions.map((session, index) => (
            <div key={index}>
              <SessionHistory session={session} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
