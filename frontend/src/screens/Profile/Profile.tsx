import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import followIcon from "../../assets/followIcon.svg";
import unfollowIcon from "../../assets/unfollowIcon.svg";
import Loader from "../Loader/Loader";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const [userProfileResponse, followStatusResponse, currentUserResponse] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_BACKEND_URL}/profile/${userId}`,
              options
            ),
            fetch(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/profile/${userId}/follow-status`,
              options
            ),
            fetch(
              `${import.meta.env.VITE_BACKEND_URL}/profile/current-user`,
              options
            ),
          ]);

        if (userProfileResponse.ok) {
          const userData = await userProfileResponse.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user profile");
        }

        if (followStatusResponse.ok) {
          const { isFollowing } = await followStatusResponse.json();
          setIsFollowing(isFollowing);
        } else {
          console.error("Failed to fetch follow status");
        }

        if (currentUserResponse.ok) {
          const { id } = await currentUserResponse.json();
          setIsCurrentUser(id === parseInt(userId ? userId : "0"));
        } else {
          console.error("Failed to fetch current user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/${userId}/follow`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setIsFollowing(!isFollowing);
        fetchUserProfile(); // Refresh user data to update follower count
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1 className={styles.username}>{user.username}</h1>
        {!isCurrentUser && (
          <button className={styles.followButton} onClick={handleFollowToggle}>
            {isFollowing ? (
              <div className={styles.followButtonContent}>
                <img src={unfollowIcon} alt="" />
                <p>Unfollow</p>
              </div>
            ) : (
              <div className={styles.followButtonContent}>
                <img src={followIcon} alt="" />
                <p>Follow</p>
              </div>
            )}
          </button>
        )}
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.followers.length}</span>
          <span className={styles.statLabel}>Followers</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.following.length}</span>
          <span className={styles.statLabel}>Following</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {user.workoutTemplates.length}
          </span>
          <span className={styles.statLabel}>Templates</span>
        </div>
      </div>
      <div className={styles.content}>
        <section className={styles.templates}>
          <h2 className={styles.sectionTitle}>Workout Templates</h2>
          <div className={styles.templatesList}>
            {user.workoutTemplates.map((template) => (
              <div key={template.id}>
                <WorkoutTemplateCard template={template} />
              </div>
            ))}
          </div>
        </section>
        <section className={styles.history}>
          <h2 className={styles.sectionTitle}>Recent workout sessions</h2>
          <div className={styles.historyList}>
            {user.workoutSessions.map((session) => (
              <div key={session.id}>
                <SessionHistory session={session} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
