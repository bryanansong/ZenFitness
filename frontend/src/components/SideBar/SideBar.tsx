import styles from "./SideBar.module.css";
import profileIcon from "../../assets/profileIcon.svg";
import dashboardIcon from "../../assets/dashboardIcon.svg";
import feedIcon from "../../assets/feedIcon.svg";
import historyIcon from "../../assets/historyIcon.svg";
import logoutIcon from "../../assets/logoutIcon.svg";
import bellIcon from "../../assets/bellIcon.svg";
import messagesIcon from "../../assets/messagesIcon.svg";
import progressPhotosIcon from "../../assets/progressPhotosIcon.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    setUsername(username ? username : "No name");
    setUserId(userId ? parseInt(userId) : 0);
  }, []);

  return (
    <div className={styles.sideBar}>
      <Link to={`/profile/${userId}`}>
        <div className={styles.profile}>
          <div className={styles.svg}>
            <img src={profileIcon} alt="" />
          </div>
          <p className={styles.sectionName}>
            Welcome,
            <br /> {username}
          </p>
        </div>
      </Link>
      <Link to={`/dashboard`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={dashboardIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Dashboard</p>
        </div>
      </Link>
      <Link to={`/feed`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={feedIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Feed</p>
        </div>
      </Link>
      <Link to={`/messages`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={messagesIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Messages</p>
        </div>
      </Link>
      <Link to={`/history`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={historyIcon} alt="" />
          </div>
          <p className={styles.sectionName}>History</p>
        </div>
      </Link>
      <Link to={`/progress-photos`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={progressPhotosIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Progress Photos</p>
        </div>
      </Link>
      <Link to={`/notifications`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={bellIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Notifications</p>
        </div>
      </Link>
      <Link to={`/login`}>
        <div
          className={styles.sidebarSection}
          onClick={() => localStorage.setItem("token", "")}
        >
          <div className={styles.svg}>
            <img src={logoutIcon} alt="" />
          </div>
          <p className={styles.sectionName}>Logout</p>
        </div>
      </Link>
    </div>
  );
};

export default SideBar;
