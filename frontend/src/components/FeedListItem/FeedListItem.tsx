import { useEffect, useState } from "react";
import styles from "./FeedListItem.module.css";

type FeedListItemProps = {
  post: WorkoutTemplate;
};

const FeedListItem: React.FC<FeedListItemProps> = ({ post }) => {
  const [upvote, setUpvote] = useState<boolean | null>(null);
  const [netVotes, setNetVotes] = useState<number>(0);

  const calculateNetVotes = () => {
    if (!post || !post.votes) {
      setNetVotes(0);
      return;
    }

    const upvotes = post.votes.filter(
      (vote) => vote.voteType === "UPVOTE"
    ).length;
    const downvotes = post.votes.filter(
      (vote) => vote.voteType === "DOWNVOTE"
    ).length;
    const netVotes = upvotes - downvotes;

    setNetVotes(netVotes);
  };

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-templates/${post.id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ voteType }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vote");
      }

      const updatedPost = await response.json();
      post.votes = updatedPost.votes;
      calculateNetVotes();

      setUpvote(voteType === "UPVOTE");
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  useEffect(() => {
    calculateNetVotes();
  }, [post]);

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
            <p>{workoutTemplateExercise.exercise.name.replaceAll("_", " ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedListItem;
