import WorkoutTemplateModal from "../WorkoutTemplateModal/WorkoutTemplateModal";
import styles from "./CreateTemplateCard.module.css";
import React, { useState } from "react";

type CreateTemplateCardProps = {
  fetchTemplates: () => void;
};

const CreateTemplateCard: React.FC<CreateTemplateCardProps> = ({
  fetchTemplates,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    fetchTemplates();
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
