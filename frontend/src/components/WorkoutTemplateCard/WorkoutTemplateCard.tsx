import styles from "./WorkoutTemplateCard.module.css";

type WorkoutTemplateCardProps = {
  template: WorkoutTemplate;
};

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({
  template,
}) => {
  const handleClick = () => {
    console.log("Opened A New Workout Session");
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <p className={styles.cardTitle}>{template.name}</p>
      <div className={styles.exerciseList}>
        {template.exercises.map((workoutTemplateExercise, index) => (
          <div key={index}>
            <p className={styles.exerciseItem}>{workoutTemplateExercise.exercise.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTemplateCard;
