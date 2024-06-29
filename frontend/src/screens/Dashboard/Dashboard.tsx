import { useState } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import Header from "../../components/Header/Header";

const Dashboard = () => {
  const [templateList, setTemplateList] = useState([]);
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <p className={styles.pageTitle}>Dashboard</p>
        <div className={styles.templateList}>
        {templateList.map((template, index) => (
          <div key={index} >
            <WorkoutTemplateCard template={template} />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
