import styles from "./FeedListItem.module.css";

type FeedListItemProps = {
  post: {
    name: string;
    user: {
      username: string;
      createdAt: string;
    };
    exercises: Array<string>;
  };
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
        {post.exercises.map((exercise, index) => (
          <div key={index} className={styles.exerciseItem}>
            <p>{exercise}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedListItem;
