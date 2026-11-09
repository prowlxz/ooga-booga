// LESSON: RENDERING ARRAYS WITH MAP()

import { useState } from 'react';
import type { Exercise } from '../types/workout';

type ExerciseListProps = {
  exercises: Exercise[];

  onUpdateExercise: (
    exerciseId: number,
    updates: Partial<Exercise>
  ) => void;

  onDeleteExercise: (exerciseId: number) => void;

  
};

function ExerciseList({
  exercises,
  onUpdateExercise,
  onDeleteExercise,
}: ExerciseListProps) {

    // Stores the ID of the exercise currently being edited.
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);

    // Stores the temporary exercise name.
  const [editName, setEditName] = useState('');
  // Stores the temporary number of sets.
  const [editSets, setEditSets] = useState(1);
  // Stores the temporary number of reps.
  const [editReps, setEditReps] = useState(1);
// Stores the temporary exercise notes.
const [editNotes, setEditNotes] = useState('');

    // Start editing an exercise.
  function handleEdit(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditName(exercise.name);
    setEditSets(exercise.sets);
    setEditReps(exercise.reps);
    setEditNotes(exercise.notes ?? '');
  }
    // Save the edited exercise.
  function handleSave(exerciseId: number) {
  // Remove unnecessary spaces from the name.
  const trimmedName = editName.trim();

  // Check whether another exercise already uses this name.
const duplicateName = exercises.some(
  (exercise) =>
    exercise.id !== exerciseId &&
    exercise.name.toLowerCase() === trimmedName.toLowerCase()
);

if (duplicateName) {
  alert('Another exercise already uses this name!');
  return;
}

  // Validate the exercise information.
  if (
    trimmedName === '' ||
    !Number.isInteger(editSets) ||
    !Number.isInteger(editReps) ||
    editSets < 1 ||
    editReps < 1
  ) {
    alert('Please enter a valid name, sets, and reps.');
    return;
  }

  // Update the exercise.
  onUpdateExercise(exerciseId, {
  name: trimmedName,
  sets: editSets,
  reps: editReps,
  notes: editNotes.trim(),
});

  setEditingExerciseId(null);
}

    // Cancel editing without saving changes.
  function handleCancel() {
  setEditingExerciseId(null);
  setEditName('');
  setEditSets(1);
  setEditReps(1);
  setEditNotes('');
}

  return (
    <section>
      <h4>Exercises</h4>

      {exercises.length === 0 ? (

        // Display this when no exercises exist.
        <p>No exercises added yet.</p>

      ) : (

        // Display every exercise using map().
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
  {editingExerciseId === exercise.id ? (
    <div>
  <input
    type="text"
    value={editName}
    onChange={(event) => setEditName(event.target.value)}
  />

  <input
    type="number"
    min="1"
    value={editSets}
    onChange={(event) => setEditSets(Number(event.target.value))}
  />

    <input
    type="number"
    min="1"
    value={editReps}
    onChange={(event) => setEditReps(Number(event.target.value))}
  />

  <label>Exercise Notes:</label>
<textarea
  value={editNotes}
  placeholder="Add instructions or reminders..."
  onChange={(event) => setEditNotes(event.target.value)}
/>

  <button
    type="button"
    onClick={() => handleSave(exercise.id)}
  >
    Save
  </button>

  <button
  type="button"
  onClick={handleCancel}
>
  Cancel
</button>
</div>
  ) : (
    <>
  <label>
    <input
      type="checkbox"
      checked={exercise.completed}
      onChange={(event) =>
        onUpdateExercise(exercise.id, {
          completed: event.target.checked,
        })
      }
    />

    {exercise.name} - {exercise.sets} sets x{' '}
    {exercise.reps} reps
  </label>

  {exercise.notes && exercise.notes.trim() !== '' && (
  <p>
    <strong>Notes:</strong> {exercise.notes}
  </p>
)}

      <button
        type="button"
        onClick={() => handleEdit(exercise)}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => {
          onUpdateExercise(exercise.id, {
            sets: exercise.sets + 1,
          });
        }}
      >
        Add 1 Set
      </button>
      <button
  type="button"
  onClick={() => onDeleteExercise(exercise.id)}
>
  Delete
</button>
    </>
  )}
</li>
          ))}
        </ul>

      )}
    </section>
  );
}

export default ExerciseList;