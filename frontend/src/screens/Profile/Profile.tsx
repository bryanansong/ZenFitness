import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import WorkoutTemplateCard from "../../components/WorkoutTemplateCard/WorkoutTemplateCard";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import followIcon from "../../assets/followIcon.svg";
import unfollowIcon from "../../assets/unfollowIcon.svg";
import messageIcon from "../../assets/messageIcon.svg";
import Loader from "../Loader/Loader";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUserProfile(),
          checkFollowStatus(),
          checkCurrentUser(),
        ]);
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
        options
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

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/${userId}/follow-status`,
        options
      );
      if (response.ok) {
        const { isFollowing } = await response.json();
        setIsFollowing(isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/current-user`,
        options
      );
      if (response.ok) {
        const { id } = await response.json();
        setIsCurrentUser(id === parseInt(userId ? userId : "0"));
      }
    } catch (error) {
      console.error("Error checking current user:", error);
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

    const handleMessageClick = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/messages/create-chat/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const { chatId } = await response.json();
          navigate(`/messages?chatId=${chatId}`);
        } else {
          console.error("Failed to create or retrieve chat");
        }
      } catch (error) {
        console.error("Error creating/retrieving chat:", error);
      }
    };

  if (!user) return <Loader />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1 className={styles.username}>{user.username}</h1>
        {!isCurrentUser && (
          <>
            {isFollowing && ( // Only show message button if the current user is following this profile
              <button
                className={styles.messageButton}
                onClick={handleMessageClick}
              >
                <div className={styles.messageButtonContent}>
                  <img src={messageIcon} alt="" />
                  <p>Message</p>
                </div>
              </button>
            )}
            <button
              className={styles.followButton}
              onClick={handleFollowToggle}
            >
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
          </>
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
