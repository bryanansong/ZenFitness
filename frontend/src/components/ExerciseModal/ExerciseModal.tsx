import React, { useEffect, useState } from "react";
import styles from "./ExerciseModal.module.css";

interface ExerciseModalProps {
  exercise: string;
  onClose: () => void;
}

interface exerciseData {
  name: string;
  category: string;
  equipment: string;
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  images: string[];
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ exercise, onClose }) => {
  const [exerciseData, setExerciseData] = useState<exerciseData>({
    name: "",
    category: "",
    equipment: "",
    instructions: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    images: [],
  });

  useEffect(() => {
    const handleFetch = async (exerciseName: string) => {
      try {
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "exercise-db-fitness-workout-gym.p.rapidapi.com",
          },
        };
        const response = await fetch(
          `https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercise/${exerciseName}`,
          options
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exercise info");
        }

        const exerciseData = await response.json();
        setExerciseData(exerciseData);
      } catch (error) {
        console.error("Error fetching exercise info:", error);
      }
    };
    handleFetch(exercise);
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{exerciseData.name}</h2>
        <div className={styles.modalBody}>
          <div className={styles.exerciseInfo}>
            <p>
              <strong>Category:</strong> {exerciseData.category}
            </p>
            <p>
              <strong>Equipment:</strong> {exerciseData.equipment}
            </p>
            <p>
              <strong>Primary Muscles:</strong>{" "}
              {exerciseData.primaryMuscles.join(", ")}
            </p>
            <p>
              <strong>Secondary Muscles:</strong>{" "}
              {exerciseData.secondaryMuscles.join(", ")}
            </p>
          </div>
          <div className={styles.instructions}>
            <h3>Instructions:</h3>
            <ol>
              {exerciseData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          {exerciseData.images && exerciseData.images.length > 0 && (
            <div className={styles.images}>
              {exerciseData.images.map((_, index) => (
                <img
                  key={index}
                  src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise}/${index}.jpg`}
                  alt={`${exerciseData.name} demonstration ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ExerciseModal;
