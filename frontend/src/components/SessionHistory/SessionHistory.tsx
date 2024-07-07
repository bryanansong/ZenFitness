import styles from "./SessionHistory.module.css";

type SessionHistoryProps = {
  session: WorkoutSession;
};

const SessionHistory: React.FC<SessionHistoryProps> = ({ session }) => {
  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];

    const suffix =
      dateNum === 1 || dateNum === 11 || dateNum === 21
        ? "st"
        : dateNum === 2 || dateNum === 12 || dateNum === 22
        ? "nd"
        : dateNum === 3 || dateNum === 13 || dateNum === 23
        ? "rd"
        : "th";

    return `${day}, ${dateNum}${suffix} ${month}`;
  };
  return (
    <div className={styles.container}>
      <p className={styles.cardTitle}>
        {session.workoutTemplate.name}
        <span className={styles.dateAndDuration}>
          <span>{formatDate(session.date)}</span>
          <span>{`${Math.round(session.duration / 60)} mins`}</span>
        </span>
      </p>
      <div className={styles.exerciseList}>
        {session?.workoutSets.map((set, index) => (
          <div key={index}>
            <p className={styles.exerciseItem}>
              <span>{set.exercise.name}</span>
              <span> |</span>
              <span> {set.weight}lbs</span>
              <span> |</span>
              <span> {set.reps} reps</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
