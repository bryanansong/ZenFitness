import React, { useEffect, useState } from "react";
import styles from "./ProgressPhotos.module.css";
import ProgressPhotoList from "../../components/ProgressPhotoList/ProgressPhotoList";
import ProgressPhotoUpload from "../../components/ProgressPhotoUpload/ProgressPhotoUpload";
import Header from "../../components/Header/Header";

const ProgressPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/progress-photos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handlePhotoUploaded = () => {
    fetchPhotos();
  };

  return (
    <div className={styles.progressPhotosContainer}>
      <Header />
      <div className={styles.content}>
        <h1 className={styles.title}>Progress Photos</h1>
        <div className={styles.uploadSection}>
          <ProgressPhotoUpload onPhotoUploaded={handlePhotoUploaded} />
        </div>
        <div className={styles.photoListSection}>
          <ProgressPhotoList photos={photos} />
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;
