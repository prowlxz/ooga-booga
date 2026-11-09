// LESSON: RENDERING ARRAYS WITH MAP()
// This component displays and manages exercises.

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

  // Stores the temporary exercise information.
  const [editName, setEditName] = useState("");
  const [editSets, setEditSets] = useState(1);
  const [editReps, setEditReps] = useState(1);
  const [editNotes, setEditNotes] = useState("");

  // Start editing an exercise.
  function handleEdit(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditName(exercise.name);
    setEditSets(exercise.sets);
    setEditReps(exercise.reps);
    setEditNotes(exercise.notes ?? "");
  }

  // Save the edited exercise.
  function handleSave(exerciseId: number) {
    const trimmedName = editName.trim();

    // Validate the exercise information.
    if (
      trimmedName === "" ||
      !Number.isInteger(editSets) ||
      !Number.isInteger(editReps) ||
      editSets < 1 ||
      editReps < 1
    ) {
      alert("Please enter a valid name, sets, and reps.");
      return;
    }

    // Prevent duplicate exercise names.
    const duplicateName = exercises.some(
      (exercise) =>
        exercise.id !== exerciseId &&
        exercise.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicateName) {
      alert("Another exercise already uses this name!");
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
    setEditName("");
    setEditSets(1);
    setEditReps(1);
    setEditNotes("");
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
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />

                  <input
                    type="number"
                    min="1"
                    value={editSets}
                    onChange={(event) =>
                      setEditSets(Number(event.target.value))
                    }
                  />

                  <input
                    type="number"
                    min="1"
                    value={editReps}
                    onChange={(event) =>
                      setEditReps(Number(event.target.value))
                    }
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
