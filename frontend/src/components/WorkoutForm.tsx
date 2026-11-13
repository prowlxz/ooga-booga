// LESSON: REUSABLE REACT COMPONENTS
// This component handles the creation of workouts.

import { memo, useEffect, useRef, useState, type FormEvent } from "react";

// PROPS: Information passed from a parent component.
type WorkoutFormProps = {
  onCreateWorkout: (name: string, category: string) => Promise<number>;
};

function WorkoutForm({ onCreateWorkout }: WorkoutFormProps) {
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

  // Track whether the timer is running.
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Store a message when the timer reaches a milestone.
  const [timerMessage, setTimerMessage] = useState("");

  // Store the interval ID without triggering a re-render.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Prevent multiple submissions before React updates the loading state.
  const submittingRef = useRef(false);

  // Reference the workout-name input element.
  const workoutNameRef = useRef<HTMLInputElement>(null);

  // Automatically focus the workout-name input when the component mounts.
  useEffect(() => {
    workoutNameRef.current?.focus();
  }, []);

  // Create and manage the timer.
  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    // Clean up the timer when paused or unmounted.
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // Display a message every 10 seconds.
  useEffect(() => {
    if (seconds > 0 && seconds % 10 === 0) {
      setTimerMessage(`You've been here for ${seconds} seconds!`);
    }
  }, [seconds]);

  // Handle form submission.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prevent duplicate submissions.
    if (submittingRef.current) {
      return;
    }

    // Remove unnecessary spaces.
    const cleanedName = workoutName.trim();

    // Validate the workout name.
    if (!cleanedName) {
      setError("Please enter a workout name.");
      return;
    }

    if (cleanedName.length < 3) {
      setError("Workout name must be at least 3 characters.");
      return;
    }

    // Clear previous errors.
    setError("");

    // Start the loading state.
    submittingRef.current = true;
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
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workout-form-card">
      <p>Elapsed time: {seconds} seconds</p>

      {timerMessage && <p>{timerMessage}</p>}

      <button
        type="button"
        onClick={() => setIsTimerRunning((previous) => !previous)}
      >
        {isTimerRunning ? "Pause Timer" : "Resume Timer"}
      </button>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <input
          ref={workoutNameRef}
          type="text"
          maxLength={50}
          placeholder="Enter workout name"
          value={workoutName}
          onChange={(event) => {
            setWorkoutName(event.target.value);

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
