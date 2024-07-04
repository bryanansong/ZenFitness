import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Feed.module.css";
import FeedListItem from "../../components/FeedListItem/FeedListItem";

const Feed = () => {
  const [postList, setPostList] = useState([]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/workout-templates/feed`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feed");
      }
      const data = await response.json();
      setPostList(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <p className={styles.pageTitle}>Feed</p>
        <div className={styles.postList}>
          {postList.map((post, index) => (
            <div key={index}>
              <FeedListItem post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
