// LESSON: CUSTOM REACT HOOKS AND API INTEGRATION
// This hook manages workout data using the FastAPI backend.

import { useCallback, useEffect, useState } from "react";

import type {
  Workout,
  Exercise,
  ExerciseUpdate,
  WorkoutStatus,
} from "../types/workout";

import { apiRequest } from "../services/api";

// This hook manages all workout-related operations.
export function useWorkouts() {
  // Store workouts retrieved from the backend.
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Track the initial loading state.
  const [isLoading, setIsLoading] = useState(true);

  // Store errors from API requests.
  const [error, setError] = useState<string | null>(null);

  // FUNCTION: Retrieve all workouts.
  const fetchWorkouts = useCallback(async () => {
    try {
      setError(null);

      const data = await apiRequest<Workout[]>("/workouts/");

      setWorkouts(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load workouts.";

      setError(message);
      console.error("Failed to fetch workouts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // EFFECT: Load workouts when the application starts.
  useEffect(() => {
    void fetchWorkouts();
  }, [fetchWorkouts]);

  // FUNCTION: Create a new workout.
  const createWorkout = useCallback(
    async (name: string, category: string): Promise<number> => {
      const newWorkout = await apiRequest<Workout>("/workouts/", {
        method: "POST",
        body: JSON.stringify({
          name,
          category,
          status: "planned",
        }),
      });

      setWorkouts((current) => [...current, newWorkout]);

      return newWorkout.id;
    },
    [],
  );

  // FUNCTION: Add an exercise to a specific workout.
  const addExercise = useCallback(
    async (
      workoutId: number,
      exerciseData: Omit<Exercise, "id" | "completed">,
    ): Promise<void> => {
      const newExercise = await apiRequest<Exercise>(
        `/workouts/${workoutId}/exercises/`,
        {
          method: "POST",
          body: JSON.stringify(exerciseData),
        },
      );

      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId
            ? {
                ...workout,
                exercises: [...workout.exercises, newExercise],
              }
            : workout,
        ),
      );
    },
    [],
  );

  // FUNCTION: Update selected properties of an exercise.
  const updateExercise = useCallback(
    async (
      workoutId: number,
      exerciseId: number,
      updates: ExerciseUpdate,
    ): Promise<void> => {
      const updatedExercise = await apiRequest<Exercise>(
        `/workouts/${workoutId}/exercises/${exerciseId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        },
      );

      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId
            ? {
                ...workout,
                exercises: workout.exercises.map((exercise) =>
                  exercise.id === exerciseId ? updatedExercise : exercise,
                ),
              }
            : workout,
        ),
      );
    },
    [],
  );

  // FUNCTION: Delete an exercise from a workout.
  const deleteExercise = useCallback(
    async (workoutId: number, exerciseId: number): Promise<void> => {
      await apiRequest(`/workouts/${workoutId}/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId
            ? {
                ...workout,
                exercises: workout.exercises.filter(
                  (exercise) => exercise.id !== exerciseId,
                ),
              }
            : workout,
        ),
      );
    },
    [],
  );

  // FUNCTION: Change the name of an existing workout.
  const updateWorkout = useCallback(
    async (workoutId: number, newName: string): Promise<void> => {
      const updatedWorkout = await apiRequest<Workout>(
        `/workouts/${workoutId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: newName.trim(),
          }),
        },
      );

      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout,
        ),
      );
    },
    [],
  );

  // FUNCTION: Change the status of an existing workout.
  const updateWorkoutStatus = useCallback(
    async (workoutId: number, status: WorkoutStatus): Promise<void> => {
      const updatedWorkout = await apiRequest<Workout>(
        `/workouts/${workoutId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );

      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout,
        ),
      );
    },
    [],
  );

  // FUNCTION: Delete a workout.
  const deleteWorkout = useCallback(
    async (workoutId: number): Promise<void> => {
      await apiRequest(`/workouts/${workoutId}`, {
        method: "DELETE",
      });

      setWorkouts((current) =>
        current.filter((workout) => workout.id !== workoutId),
      );
    },
    [],
  );

  // Return workout data and operations.
  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    createWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    updateWorkout,
    updateWorkoutStatus,
    deleteWorkout,
  };
}
