import styles from "./SessionHistory.module.css";

// TODO: Update the types for all of these
type Exercise = {
  id: number;
  name: string;
  videoUrl: string;
  workoutTemplateExercises: any;
  createdAt: Date;
};

type SetRecord = {
  id: number;
  workoutSessionId: number;
  workoutSession: any;
  exerciseId: number;
  exercise: Exercise;
  reps: number;
  weight: number;
  createdAt: Date;
};

type Session = {
  date: Date;
  workoutTemplate: any;
  duration: number; // in seconds
  completionStatus: "COMPLETED" | "PARTIAL" | null;
  setRecords: SetRecord[];
};

type SessionHistoryProps = {
  session: Session;
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
        {session?.workoutTemplate?.name || "Full Body Day"}
        <span className={styles.dateAndDuration}>
          <div>{formatDate(session.date)}</div>
          <div>{`${session.duration / 60} mins`}</div>
        </span>
      </p>
      <div className={styles.exerciseList}>
        {session?.setRecords.map((set, index) => (
          <div key={index}>
            <p className={styles.exerciseItem}>
              <div>{set.exercise.name}</div>
              <div> |</div>
              <div> {set.weight}lbs</div>
              <div> |</div>
              <div> {set.reps} reps</div>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
