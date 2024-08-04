import React, { useState } from "react";
import styles from "./ProgressPhotoCarousel.module.css";
import arrowRight from "../../assets/arrow-circle-right.svg";
import arrowLeft from "../../assets/arrow-circle-left.svg";

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
        {/* &lt; */}
        <img src={arrowLeft} alt="Previous Page" />
      </button>
      <div className={styles.imageContainer}>
        <img
          src={photos[currentIndex].imageUrl}
          alt="Progress"
          className={styles.image}
        />
      </div>
      <button className={styles.arrowButton} onClick={nextPhoto}>
        {/* &gt; */}
        <img src={arrowRight} alt="Next Page" />
      </button>
    </div>
  );
};

export default ProgressPhotoCarousel;
