import { useState } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import Header from "../../components/Header/Header";
import CreateTemplateCard from "../../components/CreateTemplateCard/CreateTemplateCard";

const Dashboard = () => {
  const [templateList, setTemplateList] = useState<WorkoutTemplate[]>([]);
  
  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <p className={styles.pageTitle}>Dashboard</p>
        <div className={styles.templateList}>
          {templateList.map((template, index) => (
            <div key={index}>
              <WorkoutTemplateCard template={template} />
            </div>
          ))}
          <CreateTemplateCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
