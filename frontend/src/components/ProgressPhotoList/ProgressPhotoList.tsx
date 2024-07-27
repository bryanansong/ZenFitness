import React from "react";
import styles from "./ProgressPhotoList.module.css";
import ProgressPhotoCarousel from "../ProgressPhotoCarousel/ProgressPhotoCarousel";

interface ProgressPhotoListProps {
  photos: ProgressPhoto[];
}

const ProgressPhotoList: React.FC<ProgressPhotoListProps> = ({ photos }) => {
  const groupPhotosByDate = (photos: ProgressPhoto[]) => {
    const grouped: { [key: string]: ProgressPhoto[] } = {};
    photos.forEach((photo) => {
      const date = new Date(photo.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(photo);
    });
    return grouped;
  };

  const groupedPhotos = groupPhotosByDate(photos);

  return (
    <div className={styles.photoList}>
      {Object.entries(groupedPhotos).map(([date, datePhotos]) => (
        <div key={date} className={styles.dateGroup}>
          <h2 className={styles.dateTitle}>{date}</h2>
          <ProgressPhotoCarousel photos={datePhotos} />
        </div>
      ))}
    </div>
  );
};

export default ProgressPhotoList;
