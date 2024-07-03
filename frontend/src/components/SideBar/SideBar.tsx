import styles from "./SideBar.module.css";
import profileIcon from "../../assets/profileIcon.svg";
import dashboardIcon from "../../assets/dashboardIcon.svg";
import feedIcon from "../../assets/feedIcon.svg";
import historyIcon from "../../assets/historyIcon.svg";
import logoutIcon from "../../assets/logoutIcon.svg";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className={styles.sideBar}>
      <div className={styles.profile}>
        <div className={styles.svg}>
          <img src={profileIcon} alt="" />
        </div>
        <p className={styles.sectionName}>
          Welcome, <br /> Bryan Ansong
        </p>
      </div>
      <div className={styles.sidebarSection}>
        <Link to={"/dashboard"}>
          <div className={styles.svg}>
            <img src={dashboardIcon} alt="" />
          </div>
        </Link>
        <p className={styles.sectionName}>Dashboard</p>
      </div>
      <div className={styles.sidebarSection}>
        <Link to={"/feed"}>
          <div className={styles.svg}>
            <img src={feedIcon} alt="" />
          </div>
        </Link>
        <p className={styles.sectionName}>Feed</p>
      </div>
      <div className={styles.sidebarSection}>
        <Link to={`/history`}>
          <div className={styles.svg}>
            <img src={historyIcon} alt="" />
          </div>
        </Link>
        <p className={styles.sectionName}>History</p>
      </div>
      <div className={styles.sidebarSection}>
        <Link to={`/`}>
          <div className={styles.svg}>
            <img src={logoutIcon} alt="" />
          </div>
        </Link>
        <p className={styles.sectionName}>Logout</p>
      </div>
    </div>
  );
};

export default SideBar;
