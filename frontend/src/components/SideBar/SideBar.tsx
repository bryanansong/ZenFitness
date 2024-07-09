import styles from "./SideBar.module.css";
import profileIcon from "../../assets/profileIcon.svg";
import dashboardIcon from "../../assets/dashboardIcon.svg";
import feedIcon from "../../assets/feedIcon.svg";
import historyIcon from "../../assets/historyIcon.svg";
import logoutIcon from "../../assets/logoutIcon.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUsername(username ? username : "No name");
  }, []);

  return (
    <div className={styles.sideBar}>
      <div className={styles.profile}>
        <div className={styles.svg}>
          <img src={profileIcon} alt="" />
        </div>
        <p className={styles.sectionName}>
          Welcome,<br /> {username}
        </p>
      </div>
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
      <Link to={`/history`}>
        <div className={styles.sidebarSection}>
          <div className={styles.svg}>
            <img src={historyIcon} alt="" />
          </div>
          <p className={styles.sectionName}>History</p>
        </div>
      </Link>
      <Link to={`/`}>
        <div className={styles.sidebarSection}>
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
