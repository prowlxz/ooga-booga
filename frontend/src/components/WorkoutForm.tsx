// LESSON: REUSABLE REACT COMPONENTS
// This component handles the creation of workouts.

import { useState, type FormEvent } from 'react';

// PROPS: Information passed from a parent component.
type WorkoutFormProps = {
  onCreateWorkout: (name: string) => void;
};

function WorkoutForm({ onCreateWorkout }: WorkoutFormProps) {

  // Store the workout name entered by the user.
  const [workoutName, setWorkoutName] = useState('');
  // Store an error message when the form is invalid.
const [error, setError] = useState('');

  // Handle form submission.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {

    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Remove unnecessary spaces.
    const cleanedName = workoutName.trim();

    // Don't allow empty workout names.
    // Check whether the workout name is empty.
if (!cleanedName) {
  setError('Please enter a workout name.');
  return;
}

// Clear any previous error if the input is valid.
setError('');

    // Send the workout name to the parent component.
    onCreateWorkout(cleanedName);

    // Clear the input after saving.
    setWorkoutName('');
  }

  return (
    <section>
      <h2>Create a Workout</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          type="text"
          placeholder="Enter workout name"
          value={workoutName}
          onChange={(event) => {
  setWorkoutName(event.target.value);

  // Clear the error when the user starts typing.
  if (error) {
    setError('');
  }
}}
          required
        />

        <button type="submit">
          Create Workout
        </button>

      </form>
    </section>
  );
}

export default WorkoutForm;