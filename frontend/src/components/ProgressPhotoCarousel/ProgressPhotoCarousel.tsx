import React, { useState } from "react";
import styles from "./ProgressPhotoCarousel.module.css";

interface ProgressPhotoCarouselProps {
  photos: ProgressPhoto[];
}

const ProgressPhotoCarousel: React.FC<ProgressPhotoCarouselProps> = ({
  photos,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  return (
    <div className={styles.carousel}>
      <button className={styles.arrowButton} onClick={prevPhoto}>
        &lt;
      </button>
      <div className={styles.imageContainer}>
        <img
          src={photos[currentIndex].imageUrl}
          alt="Progress"
          className={styles.image}
        />
      </div>
      <button className={styles.arrowButton} onClick={nextPhoto}>
        &gt;
      </button>
    </div>
  );
};

export default ProgressPhotoCarousel;
