// LESSON: COMPONENT COMPOSITION
// A WorkoutCard combines smaller reusable components.

import { memo, useEffect, useRef, useState, type FormEvent } from "react";

import type { Workout, Exercise, WorkoutStatus } from "../types/workout";

import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";

// Define the information this component receives.
type WorkoutCardProps = {
  workout: Workout;

  // Add an exercise.
  onAddExercise: (
    workoutId: number,
    name: string,
    sets: number,
    reps: number,
    notes: string,
  ) => void;

  // Update an existing exercise.
  onUpdateExercise: (
    workoutId: number,
    exerciseId: number,
    updates: Partial<Exercise>,
  ) => void;

  // Update the workout name.
  onUpdateWorkout: (workoutId: number, name: string) => void;

  // Delete a workout.
  onDeleteWorkout: (workoutId: number) => void;

  // Delete an exercise.
  onDeleteExercise: (workoutId: number, exerciseId: number) => void;

  // Update the workout status.
  onUpdateWorkoutStatus: (workoutId: number, status: WorkoutStatus) => void;
};

function WorkoutCard({
  workout,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onUpdateWorkout,
  onUpdateWorkoutStatus,
  onDeleteWorkout,
}: WorkoutCardProps) {
  // Controls whether the exercise form is visible.
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  // Controls whether the edit form is visible.
  const [isEditing, setIsEditing] = useState(false);

  // Controls whether the workout options menu is visible.
  const [showWorkoutMenu, setShowWorkoutMenu] = useState(false);

  // Reference the workout header actions container.
  const workoutMenuRef = useRef<HTMLDivElement>(null);

  // Stores the edited workout name.
  const [editName, setEditName] = useState(workout.name);

  // Stores errors when editing a workout.
  const [editError, setEditError] = useState("");

  // Close the dropdown when clicking outside the menu.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        workoutMenuRef.current &&
        !workoutMenuRef.current.contains(event.target as Node)
      ) {
        setShowWorkoutMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Choose a CSS class based on the workout status.
  const statusClass = `status-${workout.status}`;

  // Count exercises that have been completed.
  const completedExercises = workout.exercises.filter(
    (exercise) => exercise.completed,
  ).length;

  // Calculate the percentage of completed exercises.
  const completionPercentage =
    workout.exercises.length === 0
      ? 0
      : Math.round((completedExercises / workout.exercises.length) * 100);

  // Count exercises that are still incomplete.
  const remainingExercises = workout.exercises.length - completedExercises;

  // Determine whether all exercises are completed.
  const allExercisesCompleted =
    workout.exercises.length > 0 && remainingExercises === 0;

  // Save the updated workout name.
  function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedName = editName.trim();

    if (!cleanedName) return;

    try {
      onUpdateWorkout(workout.id, cleanedName);

      setEditError("");
      setIsEditing(false);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  // Ask for confirmation before deleting.
  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`,
    );

    if (confirmed) {
      onDeleteWorkout(workout.id);
    }
  }

  return (
    <article className="workout-card workout-board-column">
      {/* WORKOUT HEADER */}
      <div className="workout-card-header">
        <div className="workout-title-section">
          <h3>{workout.name}</h3>

          <p className="workout-category">{workout.category}</p>
        </div>

        <div className="workout-header-actions" ref={workoutMenuRef}>
          <span className={`status-badge ${statusClass}`}>
            {workout.status === "in-progress"
              ? "In Progress"
              : workout.status.charAt(0).toUpperCase() +
                workout.status.slice(1)}
          </span>

          {/* THREE-DOT MENU BUTTON */}
          <button
            type="button"
            className="workout-menu-button"
            aria-label={`More options for ${workout.name}`}
            aria-expanded={showWorkoutMenu}
            title="Workout options"
            onClick={() => setShowWorkoutMenu(!showWorkoutMenu)}
          >
            ⋮
          </button>

          {/* WORKOUT DROPDOWN MENU */}
          {showWorkoutMenu && (
            <div className="workout-dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setEditName(workout.name);
                  setEditError("");
                  setIsEditing(true);
                  setShowWorkoutMenu(false);
                }}
              >
                Edit Workout
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  setShowWorkoutMenu(false);
                  handleDelete();
                }}
              >
                Delete Workout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WORKOUT CONTROLS */}
      <div className="workout-controls">
        <label className="workout-status-label">
          Status:
          <select
            value={workout.status}
            onChange={(event) =>
              onUpdateWorkoutStatus(
                workout.id,
                event.target.value as WorkoutStatus,
              )
            }
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        {/* EDIT WORKOUT FORM */}
        {isEditing ? (
          <form className="workout-edit-form" onSubmit={handleEdit}>
            {editError && <p className="form-error">{editError}</p>}

            <input
              type="text"
              maxLength={50}
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);

                if (editError) {
                  setEditError("");
                }
              }}
              required
            />

            <div className="workout-actions">
              <button type="submit" className="success-button">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditName(workout.name);
                  setEditError("");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>

      <hr />

      {/* WORKOUT PROGRESS */}
      <div className="workout-progress-section">
        <div className="workout-progress-heading">
          <h4>Workout Progress</h4>

          <span className="workout-progress-percentage">
            {completionPercentage}%
          </span>
        </div>

        <div className="workout-progress-bar">
          <div
            className="workout-progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <div className="workout-progress-details">
          <p>
            {completedExercises} of {workout.exercises.length} exercises
            completed
          </p>

          <p>{remainingExercises} remaining</p>
        </div>

        {allExercisesCompleted && (
          <p className="workout-completion-message">
            🎉 All exercises completed! Great job!
          </p>
        )}
      </div>

      <hr />

      {/* ADD EXERCISE */}
      <div className="add-exercise-section">
        <button
          type="button"
          onClick={() => setShowExerciseForm(!showExerciseForm)}
        >
          {showExerciseForm ? "Close Exercise Form" : "+ Add Exercise"}
        </button>

        {showExerciseForm && (
          <ExerciseForm
            onAddExercise={(name, sets, reps, notes) => {
              onAddExercise(workout.id, name, sets, reps, notes);
              setShowExerciseForm(false);
            }}
          />
        )}
      </div>

      {/* DISPLAY EXERCISES */}
      <ExerciseList
        exercises={workout.exercises}
        onUpdateExercise={(exerciseId, updates) =>
          onUpdateExercise(workout.id, exerciseId, updates)
        }
        onDeleteExercise={(exerciseId) =>
          onDeleteExercise(workout.id, exerciseId)
        }
      />
    </article>
  );
}

export default memo(WorkoutCard);
