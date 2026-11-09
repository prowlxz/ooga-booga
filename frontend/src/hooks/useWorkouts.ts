// LESSON: CUSTOM REACT HOOKS
// useState allows us to store and update workout data.

import { useEffect, useState } from "react";
import type {
  Workout,
  Exercise,
  ExerciseUpdate,
  WorkoutStatus,
} from "../types/workout";

// This hook manages all workout-related operations.
export function useWorkouts() {
  // STATE: Stores every workout in our application.
  // Load previously saved workouts from the browser.
  // The function runs when the hook initializes.
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const savedWorkouts = localStorage.getItem("workouts");

    if (savedWorkouts) {
      try {
        return JSON.parse(savedWorkouts) as Workout[];
      } catch (error) {
        console.error("Failed to load workouts:", error);
        return [];
      }
    }

    return [];
  });
  // EFFECT: Save workouts whenever the workouts state changes.
  useEffect(() => {
    // Convert the workout array into JSON text and save it.
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  // FUNCTION: Create a new workout.
  function createWorkout(name: string) {
  const newWorkout: Workout = {
    id: Date.now(),
    name,
    status: 'planned',
    exercises: [],
  };

    // Add the new workout without deleting existing workouts.
    setWorkouts((currentWorkouts) => [...currentWorkouts, newWorkout]);

    return newWorkout.id;
  }

  // FUNCTION: Add an exercise to a specific workout.
  function addExercise(
  workoutId: number,
  exerciseData: Omit<Exercise, "id" | "completed">
) {
 

    const newExercise = {
  id: Date.now() + Math.random(),
  ...exerciseData,
  completed: false,
};

    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: [...workout.exercises, newExercise],
            }
          : workout,
      ),
    );
  }
  // FUNCTION: Update selected properties of an exercise.
  function updateExercise(
    workoutId: number,
    exerciseId: number,
    updates: ExerciseUpdate
  ) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, ...updates }
                  : exercise
              ),
            }
          : workout
      )
    );
  }
  // FUNCTION: Delete an exercise from a workout.
function deleteExercise(workoutId: number, exerciseId: number) {
  setWorkouts((currentWorkouts) =>
    currentWorkouts.map((workout) =>
      workout.id === workoutId
        ? {
            ...workout,
            exercises: workout.exercises.filter(
              (exercise) => exercise.id !== exerciseId
            ),
          }
        : workout
    )
  );
}
  // FUNCTION: Change the name of an existing workout.
  function updateWorkout(workoutId: number, newName: string) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === workoutId ? { ...workout, name: newName } : workout,
      ),
    );
  }

// FUNCTION: Change the status of an existing workout.
function updateWorkoutStatus(
  workoutId: number,
  status: WorkoutStatus
) {
  setWorkouts((currentWorkouts) =>
    currentWorkouts.map((workout) =>
      workout.id === workoutId
        ? { ...workout, status }
        : workout
    )
  );
}

  // FUNCTION: Delete a workout.
  function deleteWorkout(workoutId: number) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => workout.id !== workoutId),
    );
  }

  // Return the data and functions so other components can use them.
   return {
  workouts,
  createWorkout,
  addExercise,
  updateExercise,
  deleteExercise,
  updateWorkout,
  updateWorkoutStatus,
  deleteWorkout,
};
}