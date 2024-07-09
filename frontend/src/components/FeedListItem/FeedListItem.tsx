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

  const checkUserVote = () => {
    const stringUserId = localStorage.getItem("userId");
    const currentUserId = parseInt(stringUserId ? stringUserId : "");
    const userVote = post.votes.find((vote) => vote.userId === currentUserId);
    if (userVote) {
      setUpvote(userVote.voteType === "UPVOTE");
    } else {
      setUpvote(null);
    }
  };

  useEffect(() => {
    calculateNetVotes();
    checkUserVote();
  }, [post]);

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <h1 className={styles.templateName}>{post.name}</h1>
        <p className={styles.templateName}>Created By: {post.user.username}</p>
        <div className={styles.actionButtons}>
          <div className={styles.voteButtonGroup}>
            <div
              className={styles.upvoteButton}
              onClick={() => handleVote("UPVOTE")}
            >
              {upvote === true ? (
                <svg
                  fill="currentColor"
                  height="20"
                  icon-name="upvote-fill"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.706 8.953 10.834.372A1.123 1.123 0 0 0 10 0a1.128 1.128 0 0 0-.833.368L1.29 8.957a1.249 1.249 0 0 0-.171 1.343 1.114 1.114 0 0 0 1.007.7H6v6.877A1.125 1.125 0 0 0 7.123 19h5.754A1.125 1.125 0 0 0 14 17.877V11h3.877a1.114 1.114 0 0 0 1.005-.7 1.251 1.251 0 0 0-.176-1.347Z"></path>
                </svg>
              ) : (
                <svg
                  fill="currentColor"
                  height="20"
                  icon-name="upvote-outline"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>
                </svg>
              )}
            </div>
            <span className={styles.netVotes}>{netVotes.toLocaleString()}</span>
            <div
              className={styles.downvoteButton}
              onClick={() => handleVote("DOWNVOTE")}
            >
              {upvote === false ? (
                <svg
                  fill="currentColor"
                  height="20"
                  icon-name="downvote-fill"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.88 9.7a1.114 1.114 0 0 0-1.006-.7H14V2.123A1.125 1.125 0 0 0 12.877 1H7.123A1.125 1.125 0 0 0 6 2.123V9H2.123a1.114 1.114 0 0 0-1.005.7 1.25 1.25 0 0 0 .176 1.348l7.872 8.581a1.124 1.124 0 0 0 1.667.003l7.876-8.589A1.248 1.248 0 0 0 18.88 9.7Z"></path>
                </svg>
              ) : (
                <svg
                  fill="currentColor"
                  height="20"
                  icon-name="downvote-outline"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 20a1.122 1.122 0 0 1-.834-.372l-7.872-8.581A1.251 1.251 0 0 1 1.118 9.7 1.114 1.114 0 0 1 2.123 9H6V2.123A1.125 1.125 0 0 1 7.123 1h5.754A1.125 1.125 0 0 1 14 2.123V9h3.874a1.114 1.114 0 0 1 1.007.7 1.25 1.25 0 0 1-.171 1.345l-7.876 8.589A1.128 1.128 0 0 1 10 20Zm-7.684-9.75L10 18.69l7.741-8.44H12.75v-8h-5.5v8H2.316Zm15.469-.05c-.01 0-.014.007-.012.013l.012-.013Z"></path>
                </svg>
              )}
            </div>
          </div>
          <div className={styles.copyButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 7V4.2C7 3.0799 7 2.51984 7.21799 2.09202C7.40973 1.71569 7.71569 1.40973 8.09202 1.21799C8.51984 1 9.07989 1 10.2 1H17.8C18.9201 1 19.4802 1 19.908 1.21799C20.2843 1.40973 20.5903 1.71569 20.782 2.09202C21 2.51984 21 3.0799 21 4.2V11.8C21 12.9201 21 13.4802 20.782 13.908C20.5903 14.2843 20.2843 14.5903 19.908 14.782C19.4802 15 18.9201 15 17.8 15H15M4.2 21H11.8C12.9201 21 13.4802 21 13.908 20.782C14.2843 20.5903 14.5903 20.2843 14.782 19.908C15 19.4802 15 18.9201 15 17.8V10.2C15 9.07989 15 8.51984 14.782 8.09202C14.5903 7.71569 14.2843 7.40973 13.908 7.21799C13.4802 7 12.9201 7 11.8 7H4.2C3.0799 7 2.51984 7 2.09202 7.21799C1.71569 7.40973 1.40973 7.71569 1.21799 8.09202C1 8.51984 1 9.07989 1 10.2V17.8C1 18.9201 1 19.4802 1.21799 19.908C1.40973 20.2843 1.71569 20.5903 2.09202 20.782C2.51984 21 3.07989 21 4.2 21Z"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
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
