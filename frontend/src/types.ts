export {};

declare global {
  type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    workoutTemplates: WorkoutTemplate[];
    workoutSessions: WorkoutSession[];
    following: Follow[];
    followers: Follow[];
    votes: Vote[];
  };

  type Follow = {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: Date;
    follower: User;
    following: User;
  };

  type WorkoutTemplate = {
    id: number;
    userId: number;
    user: User;
    name: string;
    isPublic: boolean;
    exercises: WorkoutTemplateExercise[];
    workoutSessions: WorkoutSession[];
    copyCount: number;
    votes: Vote[];
    createdAt: Date;
  };

  type WorkoutTemplateExercise = {
    workoutTemplateId: number;
    exerciseId: number;
    workoutTemplate: WorkoutTemplate;
    exercise: Exercise;
  };

  type Exercise = {
    id: number;
    name: string;
    workoutTemplateExercises: WorkoutTemplateExercise[];
    setRecords: SetRecord[];
  };

  type WorkoutSession = {
    id: number;
    userId: number;
    workoutTemplateId: number;
    date: Date;
    duration: number;
    completionStatus: "COMPLETED" | "PARTIAL";
    user: User;
    workoutTemplate: WorkoutTemplate;
    setRecords: SetRecord[];
    createdAt: Date;
  };

  type SetRecord = {
    id: number;
    workoutSessionId: number;
    exerciseId: number;
    workoutSession: WorkoutSession;
    exercise: Exercise;
    reps: number;
    weight: number;
  };

  type Vote = {
    id: number;
    userId: number;
    workoutTemplateId: number;
    voteType: "UPVOTE" | "DOWNVOTE";
    user: User;
    workoutTemplate: WorkoutTemplate;
  };
}
