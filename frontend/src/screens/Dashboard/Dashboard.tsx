import { useState, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import Header from "../../components/Header/Header";
import CreateTemplateCard from "../../components/CreateTemplateCard/CreateTemplateCard";

const Dashboard = () => {
  const [templateList, setTemplateList] = useState<WorkoutTemplate[]>([]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-templates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the auth token in localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workout templates");
      }
      const data = await response.json();
      setTemplateList(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

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
          <CreateTemplateCard fetchTemplates={fetchTemplates} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
