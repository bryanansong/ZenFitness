import React, { useState, useEffect } from "react";
import styles from "./WorkoutTemplateModal.module.css";

interface WorkoutTemplateModalProps {
  closeModal: () => void;
}

const WorkoutTemplateModal: React.FC<WorkoutTemplateModalProps> = ({
  closeModal,
}) => {
  const [workoutName, setWorkoutName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<string[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          "x-rapidapi-host": "exercise-db-fitness-workout-gym.p.rapidapi.com",
        },
      };
      const response = await fetch(
        "https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises",
        options
      );
      const data = await response.json();
      setExercises(data.excercises_ids);
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    setFilteredExercises(
      exercises.filter((exercise) =>
        exercise.toLowerCase().includes(normalizedSearchTerm)
      )
    );
  }, [searchTerm, exercises]);

  const handleAddExercise = (exercise: string) => {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises((prev) => [...prev, exercise]);
    }
    setSearchTerm("");
  };

  const handleRemoveExercise = (exercise: string) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex !== exercise));
  };

  const handleCreateTemplate = async () => {
    if (!workoutName || selectedExercises.length === 0) {
      alert("Please provide a workout name and select at least one exercise.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: workoutName,
            exercises: selectedExercises,
          }),
        }
      );

      if (response.ok) {
        closeModal();
      } else {
        throw new Error("Failed to create workout templateeee");
      }
    } catch (error) {
      alert("Error creating workout template. Please try again.");
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkoutName("");
    setSearchTerm("");
    setExercises([]);
    setSelectedExercises([]);
    setFilteredExercises([]);
    closeModal();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Create Workout Template</h2>
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Workout template title"
          className={styles.input}
        />
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Exercises"
            className={styles.input}
          />
          {searchTerm && (
            <ul className={styles.dropdownList}>
              {filteredExercises.map((exercise) => (
                <li
                  key={exercise}
                  onClick={() => handleAddExercise(exercise)}
                  className={styles.dropdownItem}
                >
                  {exercise.replaceAll("_", " ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.selectedExercises}>
          <h3 className={styles.selectedExercisesTitle}>Selected Exercises</h3>
          <ul className={styles.selectedExercisesList}>
            {selectedExercises.map((exercise) => (
              <li key={exercise} className={styles.selectedExercise}>
                {exercise.replaceAll("_", " ")}
                <button
                  onClick={() => handleRemoveExercise(exercise)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleCloseModal} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={handleCreateTemplate}
            className={styles.createButton}
          >
            Create Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplateModal;
