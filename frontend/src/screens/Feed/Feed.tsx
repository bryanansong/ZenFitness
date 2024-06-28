import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Feed.module.css";

const Feed = () => {
  const [postList, setPostList] = useState([]);
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <p className={styles.pageTitle}>Feed</p>
        <div className={styles.postList}>
          {postList.map((post, index) => (
            <div key={index}>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed
