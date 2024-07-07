import React, { useState } from "react";
import styles from "./WorkoutSessionModal.module.css";

interface WorkoutSessionModalProps {
  onClose: () => void;
  template: WorkoutTemplate;
}

const WorkoutSessionModal: React.FC<WorkoutSessionModalProps> = ({
  onClose,
  template,
}) => {
  const [workoutSets, setWorkoutSets] = useState<Partial<WorkoutSet>[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [completionStatus, setCompletionStatus] = useState<
    "COMPLETED" | "PARTIAL"
  >("COMPLETED");

  const addWorkoutSet = (exerciseId: number) => {
    setWorkoutSets([...workoutSets, { exerciseId, reps: 0, weight: 0 }]);
  };

  const updateWorkoutSet = (
    index: number,
    field: "reps" | "weight",
    value: number
  ) => {
    const newWorkoutSets = [...workoutSets];
    newWorkoutSets[index][field] = value;
    setWorkoutSets(newWorkoutSets);
  };

  const removeWorkoutSet = (index: number) => {
    setWorkoutSets(workoutSets.filter((_, i) => i !== index));
  };

  const handleCreateSession = async () => {
    const newWorkoutSession: Partial<WorkoutSession> = {
      workoutTemplateId: template.id,
      date: new Date(),
      duration: duration && duration * 60, // In seconds
      completionStatus: completionStatus,
      workoutSets: workoutSets as WorkoutSet[],
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newWorkoutSession),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workout session");
      }
      onClose();
    } catch (error) {
      console.error("Error creating workout session:", error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{template.name} Session</h2>
        {template.exercises.map((workoutTemplateExercise) => {
          const exercise = workoutTemplateExercise.exercise;
          return (
            <div key={exercise.id} className={styles.exerciseSection}>
              <h3 className={styles.exerciseTitle}>
                {exercise.name.replaceAll("_", " ")}
              </h3>
              {workoutSets
                .map((set, originalIndex) => ({ set, originalIndex }))
                .filter(({ set }) => set.exerciseId === exercise.id)
                .map(({ set, originalIndex }) => (
                  <div key={originalIndex} className={styles.setRow}>
                    <div className={styles.formField}>
                      <input
                        type="number"
                        required
                        value={set.weight !== 0 ? set.weight : ""}
                        onChange={(e) =>
                          updateWorkoutSet(
                            originalIndex,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        className={styles.input}
                      />
                      <span>Weight (lbs)</span>
                    </div>
                    <div className={styles.formField}>
                      <input
                        type="number"
                        required
                        value={set.reps !== 0 ? set.reps : ""}
                        onChange={(e) =>
                          updateWorkoutSet(
                            originalIndex,
                            "reps",
                            Number(e.target.value)
                          )
                        }
                        className={styles.input}
                      />
                      <span>Reps</span>
                    </div>
                    <button
                      onClick={() => removeWorkoutSet(originalIndex)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}

              <button
                onClick={() => addWorkoutSet(exercise.id)}
                className={styles.addButton}
              >
                Add Set
              </button>
            </div>
          );
        })}
        <div className={styles.templateOptions}>
          <div className={styles.durationSection}>
            <form className={styles.formField}>
              <input
                id="duration"
                type="number"
                required
                value={duration !== 0 ? duration : ""}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.input}
              />
              <span>Duration (minutes)</span>
            </form>
          </div>
          <div className={styles.completionStatusSection}>
            <label
              htmlFor="completionStatus"
              className={styles.completionStatusLabel}
            >
              Status:
            </label>
            <select
              id="completionStatus"
              value={completionStatus}
              onChange={(e) =>
                setCompletionStatus(e.target.value as "COMPLETED" | "PARTIAL")
              }
              className={styles.select}
            >
              <option value="COMPLETED">Completed</option>
              <option value="PARTIAL">Partial</option>
            </select>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleCreateSession} className={styles.createButton}>
            Create Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSessionModal;
