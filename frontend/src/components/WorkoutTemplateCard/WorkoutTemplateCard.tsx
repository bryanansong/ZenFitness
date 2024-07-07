import styles from "./WorkoutTemplateCard.module.css";

type WorkoutTemplateCardProps = {
  template: WorkoutTemplate;
};

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({
  template,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.cardTitle}>{template.name}</p>
      <div className={styles.exerciseList}>
        {template.exercises.map((workoutTemplateExercise, index) => (
          <div key={index}>
            <p className={styles.exerciseItem}>
              {workoutTemplateExercise.exercise.name.replaceAll("_", " ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTemplateCard;
