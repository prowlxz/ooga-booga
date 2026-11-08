// LESSON: COMPONENT COMPOSITION
// A WorkoutCard combines smaller reusable components.

import { useState, type FormEvent } from 'react';

import type { Workout } from '../types/workout';

import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';

// Define the information this component receives.
type WorkoutCardProps = {
  workout: Workout;

  onAddExercise: (
    workoutId: number,
    name: string,
    sets: number,
    reps: number
  ) => void;

  onUpdateWorkout: (workoutId: number, name: string) => void;

  onDeleteWorkout: (workoutId: number) => void;
};

function WorkoutCard({
  workout,
  onAddExercise,
  onUpdateWorkout,
  onDeleteWorkout,
}: WorkoutCardProps) {

  // Controls whether the exercise form is visible.
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  // Controls whether the edit form is visible.
  const [isEditing, setIsEditing] = useState(false);

  // Stores the edited workout name.
  const [editName, setEditName] = useState(workout.name);

  // Save the updated workout name.
  function handleEdit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const cleanedName = editName.trim();

    if (!cleanedName) return;

    onUpdateWorkout(workout.id, cleanedName);

    setIsEditing(false);
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
          onAddExercise={(name, sets, reps) => {

            onAddExercise(workout.id, name, sets, reps);

            setShowExerciseForm(false);

          }}
        />

      )}

      {/* DISPLAY EXERCISES */}
      <ExerciseList exercises={workout.exercises} />

      <hr />

    </article>
  );
}

export default WorkoutCard;