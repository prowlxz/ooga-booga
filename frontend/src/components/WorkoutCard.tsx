// LESSON: COMPONENT COMPOSITION
// A WorkoutCard combines smaller reusable components.
import '../App.css';
import { useState, type FormEvent } from 'react';

import type {
  Workout,
  Exercise,
  WorkoutStatus,
} from '../types/workout';

import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';

// Define the information this component receives.
type WorkoutCardProps = {
  workout: Workout;

  // Add an exercise.
  onAddExercise: (
  workoutId: number,
  name: string,
  sets: number,
  reps: number,
  notes: string
) => void;

   // Update an existing exercise.
  onUpdateExercise: (
    workoutId: number,
    exerciseId: number,
    updates: Partial<Exercise>
  ) => void;

  // Update the workout name.
  onUpdateWorkout: (workoutId: number, name: string) => void;

  // Delete a workout.
  onDeleteWorkout: (workoutId: number) => void;

    // Delete an exercise.
  onDeleteExercise: (
    workoutId: number,
    exerciseId: number
  ) => void;

  // Update the workout status.
  onUpdateWorkoutStatus: (
  workoutId: number,
  status: WorkoutStatus
  ) => void;
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

  // Stores the edited workout name.
  const [editName, setEditName] = useState(workout.name);

  // Choose a CSS class based on the workout status.
  const statusClass = `status-${workout.status}`;

  // Count exercises that have been completed.
const completedExercises = workout.exercises.filter(
  (exercise) => exercise.completed
).length;

// Calculate the percentage of completed exercises.
const completionPercentage = workout.exercises.length === 0
  ? 0
  : Math.round(
      (completedExercises / workout.exercises.length) * 100
    );

    // Count exercises that are still incomplete.
const remainingExercises =
  workout.exercises.length - completedExercises;

  // Determine whether all exercises are completed.
const allExercisesCompleted =
  workout.exercises.length > 0 &&
  remainingExercises === 0;

  // Save the updated workout name.
  function handleEdit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const cleanedName = editName.trim();

    if (!cleanedName) return;

    onUpdateWorkout(workout.id, cleanedName);

    setIsEditing(false);
  }

// Check whether an exercise already exists in this workout.
function isDuplicateExercise(name: string) {
  return workout.exercises.some(
    (exercise) =>
      exercise.name.toLowerCase() === name.trim().toLowerCase()
  );
}

  // Ask for confirmation before deleting.
  function handleDelete() {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`
    );

    if (confirmed) {
      onDeleteWorkout(workout.id);
    }
  }

  return (
    <article>

      {/* Display the workout name. */}
      <h3>{workout.name}</h3>
{/* DISPLAY STATUS BADGE */}
<span className={`status-badge ${statusClass}`}>
  {workout.status === 'in-progress'
  ? 'In Progress'
  : workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
</span>

      {/* WORKOUT STATUS */}
<label>
  Status:

  <select
    value={workout.status}
    onChange={(event) =>
      onUpdateWorkoutStatus(
        workout.id,
        event.target.value as WorkoutStatus
      )
    }
  >
    <option value="planned">Planned</option>
    <option value="in-progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</label>

      {/* EDIT WORKOUT */}
      {isEditing ? (

        <form onSubmit={handleEdit}>

          <input
            type="text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            required
          />

          <button type="submit">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => {
              setEditName(workout.name);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>

        </form>

      ) : (

        <button
          type="button"
          onClick={() => {
            setEditName(workout.name);
            setIsEditing(true);
          }}
        >
          Edit Workout
        </button>

      )}

      {/* DELETE WORKOUT */}
      <button type="button" onClick={handleDelete}>
        Delete Workout
      </button>

      <hr />

      {/* ADD EXERCISE */}
      <button
        type="button"
        onClick={() => setShowExerciseForm(!showExerciseForm)}
      >
        {showExerciseForm ? 'Close Exercise Form' : 'Add Exercise'}
      </button>

      {showExerciseForm && (

        <ExerciseForm
  onAddExercise={(name, sets, reps, notes) => {

  if (isDuplicateExercise(name)) {
    alert('This exercise already exists in this workout!');
    return;
  }

  onAddExercise(workout.id, name, sets, reps, notes);

  setShowExerciseForm(false);

}}
        />

      )}

      
      {/* WORKOUT COMPLETION PROGRESS */}
<div>
  <h4>Workout Progress</h4>

  <p>{completionPercentage}% Completed</p>

  <p>
  {completedExercises} of {workout.exercises.length} exercises completed
</p>

<p>
  {remainingExercises} exercises remaining
</p>

{allExercisesCompleted && (
  <p>🎉 All exercises completed! Great job!</p>
)}

  <div className="workout-progress-bar">
    <div
      className="workout-progress-fill"
      style={{ width: `${completionPercentage}%` }}
    ></div>
  </div>
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
      <hr />

    </article>
  );
}

export default WorkoutCard;