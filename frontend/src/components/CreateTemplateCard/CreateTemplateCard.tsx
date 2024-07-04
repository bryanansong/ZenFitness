import WorkoutTemplateModal from "../WorkoutTemplateModal/WorkoutTemplateModal";
import styles from "./CreateTemplateCard.module.css";
import { useState } from "react";

const CreateTemplateCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal", "open? ", isModalOpen);
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && <WorkoutTemplateModal closeModal={closeModal} />}
      <div className={styles.container} onClick={() => handleClick()}>
        <p className={styles.cardTitle}>Create workout template</p>
      </div>
    </>
  );
};

export default CreateTemplateCard;
