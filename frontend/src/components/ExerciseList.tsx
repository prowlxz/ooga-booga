// LESSON: RENDERING ARRAYS WITH MAP()
// This component displays, edits, and manages exercises.

import { useState } from "react";
import type { Exercise } from "../types/workout";

// Define the information this component receives.
type ExerciseListProps = {
  exercises: Exercise[];

  onUpdateExercise: (exerciseId: number, updates: Partial<Exercise>) => void;

  onDeleteExercise: (exerciseId: number) => void;
};

function ExerciseList({
  exercises,
  onUpdateExercise,
  onDeleteExercise,
}: ExerciseListProps) {
  // Stores the ID of the exercise currently being edited.
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(
    null,
  );

  // Stores temporary exercise information.
  const [editName, setEditName] = useState("");
  const [editSets, setEditSets] = useState(1);
  const [editReps, setEditReps] = useState(1);
  const [editNotes, setEditNotes] = useState("");

  // Stores validation error messages.
  const [editError, setEditError] = useState("");

  // Start editing an exercise.
  function handleEdit(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditName(exercise.name);
    setEditSets(exercise.sets);
    setEditReps(exercise.reps);
    setEditNotes(exercise.notes ?? "");
    setEditError("");
  }

  // Save the edited exercise.
  function handleSave(exerciseId: number) {
    const trimmedName = editName.trim();

    // Validate the exercise information.
    if (!trimmedName) {
      setEditError("Please enter an exercise name.");
      return;
    }

    if (trimmedName.length > 50) {
      setEditError("Exercise names cannot exceed 50 characters.");
      return;
    }

    if (!Number.isInteger(editSets) || editSets < 1) {
      setEditError("Sets must be a whole number greater than 0.");
      return;
    }

    if (!Number.isInteger(editReps) || editReps < 1) {
      setEditError("Repetitions must be a whole number greater than 0.");
      return;
    }

    // Prevent duplicate exercise names.
    const duplicateName = exercises.some(
      (exercise) =>
        exercise.id !== exerciseId &&
        exercise.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicateName) {
      setEditError("Another exercise already uses this name.");
      return;
    }

    // Update the exercise.
    onUpdateExercise(exerciseId, {
      name: trimmedName,
      sets: editSets,
      reps: editReps,
      notes: editNotes.trim(),
    });

    // Close the edit form after successful saving.
    handleCancel();
  }

  // Cancel editing without saving changes.
  function handleCancel() {
    setEditingExerciseId(null);
    setEditName("");
    setEditSets(1);
    setEditReps(1);
    setEditNotes("");
    setEditError("");
  }

  return (
    <section className="exercise-list-section">
      <h4>Exercises</h4>

      {exercises.length === 0 ? (
        // Display this when no exercises exist.
        <p>No exercises added yet.</p>
      ) : (
        // Display every exercise using map().
        <ul className="exercise-list">
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className={`exercise-item ${
                exercise.completed ? "exercise-completed" : ""
              }`}
            >
              {editingExerciseId === exercise.id ? (
                // EDIT EXERCISE FORM
                <div className="exercise-edit-form">
                  {editError && (
                    <p className="form-error" role="alert">
                      {editError}
                    </p>
                  )}

                  <input
                    type="text"
                    maxLength={50}
                    placeholder="Exercise name"
                    value={editName}
                    onChange={(event) => {
                      setEditName(event.target.value);
                      setEditError("");
                    }}
                  />

                  <label>Sets:</label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={editSets}
                    onChange={(event) => {
                      setEditSets(Number(event.target.value));
                      setEditError("");
                    }}
                  />

                  <label>Repetitions:</label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={editReps}
                    onChange={(event) => {
                      setEditReps(Number(event.target.value));
                      setEditError("");
                    }}
                  />

                  <label>Exercise Notes:</label>

                  <textarea
                    value={editNotes}
                    placeholder="Add instructions or reminders..."
                    onChange={(event) => setEditNotes(event.target.value)}
                  />

                  <div className="exercise-actions">
                    <button
                      type="button"
                      className="success-button"
                      onClick={() => handleSave(exercise.id)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // NORMAL EXERCISE DISPLAY
                <>
                  <label className="exercise-checkbox-label">
                    <input
                      type="checkbox"
                      checked={exercise.completed}
                      onChange={(event) =>
                        onUpdateExercise(exercise.id, {
                          completed: event.target.checked,
                        })
                      }
                    />

                    <span className="exercise-name">{exercise.name}</span>

                    <span className="exercise-details">
                      {exercise.sets} sets x {exercise.reps} reps
                    </span>
                  </label>

                  {exercise.notes && exercise.notes.trim() !== "" && (
                    <p className="exercise-notes">
                      <strong>Notes:</strong> {exercise.notes}
                    </p>
                  )}

                  {/* EXERCISE ACTION BUTTONS */}
                  <div className="exercise-actions">
                    <button type="button" onClick={() => handleEdit(exercise)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateExercise(exercise.id, {
                          sets: exercise.sets + 1,
                        })
                      }
                    >
                      Add 1 Set
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => onDeleteExercise(exercise.id)}
                    >
                      Delete
                    </button>
                  </div>
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
