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
    workoutSets: WorkoutSet[];
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
    workoutSets: WorkoutSet[];
    createdAt: Date;
  };

  type WorkoutSet = {
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

  type NotificationItem = {
    id: number;
    type: string;
    content: string;
    createdAt: string;
    status: string;
  };

  type Message = {
    id: number;
    senderId: number;
    content: string;
    timestamp: string;
  };

  type Chat = {
    id: number;
    participants: User[];
    messages: Message[];
    lastMessage?: string;
    otherUser: User;
  };

  type ProgressPhoto = {
    id: number;
    userId: number;
    user: User;
    imageUrl: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}
