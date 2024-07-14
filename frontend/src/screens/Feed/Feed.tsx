import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./Feed.module.css";
import FeedListItem from "../../components/FeedListItem/FeedListItem";
import arrowRight from "../../assets/arrow-circle-right.svg";
import arrowLeft from "../../assets/arrow-circle-left.svg";

const Feed = () => {
  const [postList, setPostList] = useState<WorkoutTemplate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTemplates = async (page = 1) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/workout-templates/feed?page=${page}&limit=2`,
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
      setPostList(data.recommendations);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTemplates(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchTemplates(currentPage - 1);
    }
  };

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
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <img src={arrowLeft} alt="Previous Page" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <img src={arrowRight} alt="Next Page" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
