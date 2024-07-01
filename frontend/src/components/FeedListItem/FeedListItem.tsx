import styles from "./FeedListItem.module.css";

type FeedListItemProps = {
  post: WorkoutTemplate,
};

const FeedListItem: React.FC<FeedListItemProps> = ({ post }) => {
  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <h1 className={styles.templateName}>{post.name}</h1>
        <p className={styles.templateName}>Created By: {post.user.username}</p>
        <div className={styles.button}>Copy Template</div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.exerciseList}>
        {post.exercises.map((workoutTemplateExercise, index) => (
          <div key={index} className={styles.exerciseItem}>
            <p>{workoutTemplateExercise.exercise.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedListItem;
