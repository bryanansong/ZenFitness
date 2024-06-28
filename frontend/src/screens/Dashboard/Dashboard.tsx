import { useState } from "react";
import styles from "../Dashboard/Dashboard.module.css"

const Dashboard = () => {
  const [templateList, setTemplateList] = useState([null, null, null])
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.searchBar}>Search Bar</div>
      <div className={styles.dashboardContent}>
        <p className={styles.pageTitle}>Dashboard</p>
        <div className={styles.templateList}>
        {templateList.map((template, index) => (
          <div key={index} className={styles.workoutTemplate}>
            <h1>Thursday Workout</h1>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
