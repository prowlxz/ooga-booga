// LESSON: REUSABLE REACT COMPONENTS
// This component handles the creation of workouts.

import { memo, useEffect, useState, type FormEvent } from "react";

// PROPS: Information passed from a parent component.
type WorkoutFormProps = {
  onCreateWorkout: (name: string, category: string) => Promise<number>;
};

function WorkoutForm({ onCreateWorkout }: WorkoutFormProps) {
  // Track whenever this component renders.
  console.count("WorkoutForm rendered");

  // Store the workout name entered by the user.
  const [workoutName, setWorkoutName] = useState("");

  // Store the selected workout category.
  const [category, setCategory] = useState("Strength");

  // Store an error message when the form is invalid.
  const [error, setError] = useState("");

  // Track whether the workout is being created.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store the number of seconds elapsed.
  const [seconds, setSeconds] = useState(0);

  // Store a message when the timer reaches a milestone.
  const [timerMessage, setTimerMessage] = useState("");

  // Display a message when the timer reaches a milestone.
  useEffect(() => {
    if (seconds > 0 && seconds % 10 === 0) {
      setTimerMessage(`You've been here for ${seconds} seconds!`);
    }
  }, [seconds]);

  // Track whether the timer is running.
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Run an effect after the component renders.
  useEffect(() => {
    console.log("WorkoutForm mounted.");

    return () => {
      console.log("WorkoutForm unmounted.");
    };
  }, []);

  // Create a timer when the component mounts.
  // Update the timer every second.
  // Run the timer only when isTimerRunning is true.
  useEffect(() => {
    // Stop here if the timer is paused.
    if (!isTimerRunning) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    // Clean up the timer when the effect runs again.
    return () => {
      clearInterval(timer);
    };
  }, [isTimerRunning]);

  // Handle form submission.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Remove unnecessary spaces.
    const cleanedName = workoutName.trim();

    // Don't allow empty workout names.
    if (!cleanedName) {
      setError("Please enter a workout name.");
      return;
    }

    // Require at least 3 characters.
    if (cleanedName.length < 3) {
      setError("Workout name must be at least 3 characters.");
      return;
    }

    // Clear any previous error if the input is valid.
    setError("");

    // Start the loading state.
    setIsSubmitting(true);

    try {
      await onCreateWorkout(cleanedName, category);

      // Clear the form only after successful creation.
      setWorkoutName("");
      setCategory("Strength");
    } catch (error) {
      console.error("Failed to create workout:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workout-form-card">
      <p>Elapsed time: {seconds} seconds</p>

      {timerMessage && <p>{timerMessage}</p>}

      <button type="button" onClick={() => setIsTimerRunning(!isTimerRunning)}>
        {isTimerRunning ? "Pause Timer" : "Resume Timer"}
      </button>

      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <input
          type="text"
          maxLength={50}
          placeholder="Enter workout name"
          value={workoutName}
          onChange={(event) => {
            setWorkoutName(event.target.value);

            // Clear the error when the user starts typing.
            if (error) {
              setError("");
            }
          }}
          required
        />

        <label htmlFor="category">Workout Category:</label>

        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Recovery">Recovery</option>
        </select>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Workout"}
        </button>
      </form>
    </section>
  );
}

export default memo(WorkoutForm);
