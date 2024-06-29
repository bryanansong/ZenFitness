import { useState } from "react";
import Header from "../../components/Header/Header";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import styles from "./History.module.css";

const History = () => {
  const [streak, setStreak] = useState(10);
  const [pastSessions, setPastSessions] = useState([]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <p className={styles.pageTitle}>Overview</p>
        <div className={styles.overviewTiles}>
          <div className={styles.overviewSide}>
            <div className={`${styles.tile} ${styles.overviewLeft}`}>
              <p className={styles.workoutsNumber}>50</p>
              <p className={styles.tileHeroText}>Workouts performed so far</p>
            </div>
          </div>

          <div className={styles.overviewSide}>
            <div className={styles.overviewUpper}>
              <div className={`${styles.tile} ${styles.timeTile}`}>
                <p className={styles.timeTileHours}>150</p>
                <p className={styles.timeTileText}>
                  Total Hours Spent Working Out
                </p>
              </div>
              <div className={styles.tile}>
                <p className={styles.tileText}>
                  {"Bicep Curl"} is your favorite exercise
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
                Days In A Row!
              </div>
            </div>
          </div>
        </div>
        <p className={styles.pageTitle}>Past Sessions</p>
        <div className={styles.pastSessions}>
          {pastSessions.map((session, index) => (
            <div key={index}>
              <SessionHistory />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;