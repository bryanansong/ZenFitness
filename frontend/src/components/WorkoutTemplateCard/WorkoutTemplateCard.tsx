import styles from "./WorkoutTemplateCard.module.css";

// TODO: Change the types mentioned here to reflect final object
type workoutTemplate = {
  name: string;
  exercises: Array<string>;
};

type WorkoutTemplateCardProps = {
  template: workoutTemplate;
};

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({
  template,
}) => {
  // TODO: Implement onclick method to open a workout session page
  return (
    <div className={styles.container} onClick={() => {}}>
      <p className={styles.cardTitle}>
        {template ? template.name : "No name yet"}
      </p>
      <div className={styles.exerciseList}>
        {template.exercises.map((exercise: string, index: number) => (
          <div key={index}>
            <p className={styles.exerciseItem}>{exercise}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTemplateCard;
