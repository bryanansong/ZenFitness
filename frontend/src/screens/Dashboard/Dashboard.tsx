import { useState, useEffect } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import Header from "../../components/Header/Header";
import CreateTemplateCard from "../../components/CreateTemplateCard/CreateTemplateCard";
import WorkoutSessionModal from "../../components/WorkoutSessionModal/WorkoutSessionModal";

const Dashboard = () => {
  const [templateList, setTemplateList] = useState<WorkoutTemplate[]>([]);

  const [isWorkoutSessionOpen, setIsWorkoutSessionOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutTemplate | null>(null);

  const handleTemplateClick = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setIsWorkoutSessionOpen(true);
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-templates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workout templates");
      }
      const data = await response.json();
      setTemplateList(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {selectedTemplate && isWorkoutSessionOpen ? (
        <WorkoutSessionModal
          onClose={() => setIsWorkoutSessionOpen(false)}
          template={selectedTemplate}
        />
      ) : <></>}
      <Header />
      <div className={styles.dashboardContent}>
        <p className={styles.pageTitle}>Dashboard</p>
        <div className={styles.templateList}>
          {templateList.map((template, index) => (
            <div
              key={index}
              onClick={() => {
                handleTemplateClick(template);
              }}
            >
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
