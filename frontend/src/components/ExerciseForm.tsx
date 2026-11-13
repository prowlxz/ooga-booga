import { useState, type FormEvent } from "react";

type AddExerciseHandler = (
  name: string,
  sets: number,
  reps: number,
  notes: string,
) => Promise<void>;

type ExerciseFormProps = {
  onAddExercise: AddExerciseHandler;
};

function ExerciseForm({ onAddExercise }: ExerciseFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateExercise(cleanedName: string): string {
    if (!cleanedName) {
      return "Please enter an exercise name.";
    }

    if (cleanedName.length > 100) {
      return "Exercise names cannot exceed 100 characters.";
    }

    if (!Number.isInteger(sets) || sets < 1) {
      return "Sets must be a whole number greater than 0.";
    }

    if (!Number.isInteger(reps) || reps < 1) {
      return "Repetitions must be a whole number greater than 0.";
    }

    if (notes.length > 500) {
      return "Notes cannot exceed 500 characters.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedName = exerciseName.trim();
    const validationError = validateExercise(cleanedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onAddExercise(cleanedName, sets, reps, notes.trim());

      setExerciseName("");
      setSets(3);
      setReps(12);
      setNotes("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save exercise. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <h4>New Exercise</h4>

      <input
        type="text"
        maxLength={100}
        placeholder="Exercise name"
        value={exerciseName}
        onChange={(event) => {
          setExerciseName(event.target.value);
          setError("");
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
        maxLength={500}
        placeholder="Add instructions or reminders..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Exercise"}
      </button>
    </form>
  );
}

export default ExerciseForm;
