import styles from "./CreateTemplateCard.module.css";

const CreateTemplateCard = () => {
  // TODO: Make this trigger the opneing of a modal to create a modal
  const handleClick = () => {
    console.log("Opened Workout Creation Modal");
  };

  return (
    <div className={styles.container} onClick={() => handleClick()}>
      <p className={styles.cardTitle}>Create New Template</p>
    </div>
  );
};

export default CreateTemplateCard;
