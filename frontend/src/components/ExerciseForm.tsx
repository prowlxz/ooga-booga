
// LESSON: COMPONENT PROPS AND FORM HANDLING

import { useState, type FormEvent } from 'react';

// Describes the information needed to add an exercise.
type AddExerciseHandler = (
  name: string,
  sets: number,
  reps: number,
  notes: string
) => void;

// Describes the props accepted by ExerciseForm.
type ExerciseFormProps = {
  onAddExercise: AddExerciseHandler;
};

function ExerciseForm({ onAddExercise }: ExerciseFormProps) {

  // Store the exercise information.
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [notes, setNotes] = useState('');

  // Store validation error messages.
  const [error, setError] = useState('');

  function validateExercise(cleanedName: string): string {
    if (!cleanedName) {
      return 'Please enter an exercise name.';
    }

    if (!Number.isInteger(sets) || sets < 1) {
      return 'Sets must be a whole number greater than 0.';
    }

    if (!Number.isInteger(reps) || reps < 1) {
      return 'Repetitions must be a whole number greater than 0.';
    }

    return '';
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Remove unnecessary spaces from the exercise name.
    const cleanedName = exerciseName.trim();

    // Run the validation function.
    const validationError = validateExercise(cleanedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    // Clear any previous validation error.
    setError('');

    // Send exercise information to the parent component.
    onAddExercise(cleanedName, sets, reps, notes.trim());

    // Reset the form after saving.
    setExerciseName('');
    setSets(3);
    setReps(12);
    setNotes('');
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h4>New Exercise</h4>

      <input
        type="text"
        placeholder="Exercise name"
        value={exerciseName}
        onChange={(event) => {
          setExerciseName(event.target.value);

          // Clear the error when the user starts correcting the input.
          if (error) {
            setError('');
          }
        }}
        required
      />

      <label>Sets:</label>

      <input
        type="number"
        min="1"
        value={sets}
        onChange={(event) => setSets(Number(event.target.value))}
        required
      />

      <label>Repetitions:</label>

      <input
        type="number"
        min="1"
        value={reps}
        onChange={(event) => setReps(Number(event.target.value))}
        required
      />

      <label>Notes (Optional):</label>

      <textarea
        placeholder="Add instructions or reminders..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <button type="submit">
        Save Exercise
      </button>
    </form>
  );
}

export default ExerciseForm;
