import { memo, useEffect, useRef, useState, type FormEvent } from "react";

import type { Workout, Exercise, WorkoutStatus } from "../types/workout";

import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";

type WorkoutCardProps = {
  workout: Workout;

  onAddExercise: (
    workoutId: number,
    name: string,
    sets: number,
    reps: number,
    notes: string,
  ) => Promise<void>;

  onUpdateExercise: (
    workoutId: number,
    exerciseId: number,
    updates: Partial<Exercise>,
  ) => Promise<void>;

  onUpdateWorkout: (workoutId: number, name: string) => Promise<void>;

  onDeleteWorkout: (workoutId: number) => Promise<void>;

  onDeleteExercise: (workoutId: number, exerciseId: number) => Promise<void>;

  onUpdateWorkoutStatus: (
    workoutId: number,
    status: WorkoutStatus,
  ) => Promise<void>;
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
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showWorkoutMenu, setShowWorkoutMenu] = useState(false);

  const workoutMenuRef = useRef<HTMLDivElement>(null);

  const [editName, setEditName] = useState(workout.name);
  const [editError, setEditError] = useState("");
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);

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

  const statusClass = `status-${workout.status}`;

  const completedExercises = workout.exercises.filter(
    (exercise) => exercise.completed,
  ).length;

  const completionPercentage =
    workout.exercises.length === 0
      ? 0
      : Math.round((completedExercises / workout.exercises.length) * 100);

  const remainingExercises = workout.exercises.length - completedExercises;

  const allExercisesCompleted =
    workout.exercises.length > 0 && remainingExercises === 0;

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedName = editName.trim();

    if (!cleanedName) return;

    setIsSavingWorkout(true);

    try {
      await onUpdateWorkout(workout.id, cleanedName);

      setEditError("");
      setIsEditing(false);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSavingWorkout(false);
    }
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`,
    );

    if (confirmed) {
      void onDeleteWorkout(workout.id).catch((error) => {
        window.alert(
          error instanceof Error ? error.message : "Failed to delete workout.",
        );
      });
    }
  }

  return (
    <article className="workout-card workout-board-column">
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

      <div className="workout-controls">
        <label className="workout-status-label">
          Status:
          <select
            value={workout.status}
            onChange={(event) => {
              void onUpdateWorkoutStatus(
                workout.id,
                event.target.value as WorkoutStatus,
              ).catch((error) => {
                window.alert(
                  error instanceof Error
                    ? error.message
                    : "Failed to update workout status.",
                );
              });
            }}
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        {isEditing ? (
          <form className="workout-edit-form" onSubmit={handleEdit}>
            {editError && <p className="form-error">{editError}</p>}

            <input
              type="text"
              maxLength={100}
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
              <button
                type="submit"
                className="success-button"
                disabled={isSavingWorkout}
              >
                {isSavingWorkout ? "Saving..." : "Save Changes"}
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

      <div className="add-exercise-section">
        <button
          type="button"
          onClick={() => setShowExerciseForm(!showExerciseForm)}
        >
          {showExerciseForm ? "Close Exercise Form" : "+ Add Exercise"}
        </button>

        {showExerciseForm && (
          <ExerciseForm
            onAddExercise={async (name, sets, reps, notes) => {
              await onAddExercise(workout.id, name, sets, reps, notes);
              setShowExerciseForm(false);
            }}
          />
        )}
      </div>

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
