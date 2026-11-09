// LESSON: TYPESCRIPT CUSTOM TYPES
// These types define the structure of our application data.

// An Exercise represents one exercise inside a workout.
// TypeScript checks that objects follow this structure.
export type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  notes?: string;
  completed: boolean;
};

// This must be outside the Exercise type.
export type ExerciseSummary = Pick<Exercise, 'name' | 'sets'>;
// Allows us to update only selected exercise properties.
export type ExerciseUpdate = Partial<Exercise>;
// A Workout contains a name and multiple exercises.
// A workout can have one of these three statuses.
export type WorkoutStatus = 'planned' | 'in-progress' | 'completed';
export type Workout = {
  id: number;
  name: string;
  status: WorkoutStatus;
  category: string;
  exercises: Exercise[];
};