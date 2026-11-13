import { useState } from "react";
import type { Exercise } from "../types/workout";

type ExerciseListProps = {
  exercises: Exercise[];

  onUpdateExercise: (
    exerciseId: number,
    updates: Partial<Exercise>,
  ) => Promise<void>;

  onDeleteExercise: (exerciseId: number) => Promise<void>;
};

function ExerciseList({
  exercises,
  onUpdateExercise,
  onDeleteExercise,
}: ExerciseListProps) {
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(
    null,
  );

  const [editName, setEditName] = useState("");
  const [editSets, setEditSets] = useState(1);
  const [editReps, setEditReps] = useState(1);
  const [editNotes, setEditNotes] = useState("");

  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleEdit(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditName(exercise.name);
    setEditSets(exercise.sets);
    setEditReps(exercise.reps);
    setEditNotes(exercise.notes ?? "");
    setEditError("");
  }

  async function handleSave(exerciseId: number) {
    const trimmedName = editName.trim();

    if (!trimmedName) {
      setEditError("Please enter an exercise name.");
      return;
    }

    if (trimmedName.length > 100) {
      setEditError("Exercise names cannot exceed 100 characters.");
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

    if (editNotes.length > 500) {
      setEditError("Notes cannot exceed 500 characters.");
      return;
    }

    const duplicateName = exercises.some(
      (exercise) =>
        exercise.id !== exerciseId &&
        exercise.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicateName) {
      setEditError("Another exercise already uses this name.");
      return;
    }

    setIsSaving(true);
    setEditError("");

    try {
      await onUpdateExercise(exerciseId, {
        name: trimmedName,
        sets: editSets,
        reps: editReps,
        notes: editNotes.trim(),
      });

      handleCancel();
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update exercise. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setEditingExerciseId(null);
    setEditName("");
    setEditSets(1);
    setEditReps(1);
    setEditNotes("");
    setEditError("");
  }

  function handleDelete(exerciseId: number) {
    void onDeleteExercise(exerciseId).catch((error) => {
      window.alert(
        error instanceof Error ? error.message : "Failed to delete exercise.",
      );
    });
  }

  return (
    <section className="exercise-list-section">
      <h4>Exercises</h4>

      {exercises.length === 0 ? (
        <p>No exercises added yet.</p>
      ) : (
        <ul className="exercise-list">
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              className={`exercise-item ${
                exercise.completed ? "exercise-completed" : ""
              }`}
            >
              {editingExerciseId === exercise.id ? (
                <div className="exercise-edit-form">
                  {editError && (
                    <p className="form-error" role="alert">
                      {editError}
                    </p>
                  )}

                  <input
                    type="text"
                    maxLength={100}
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
                    maxLength={500}
                    value={editNotes}
                    placeholder="Add instructions or reminders..."
                    onChange={(event) => setEditNotes(event.target.value)}
                  />

                  <div className="exercise-actions">
                    <button
                      type="button"
                      className="success-button"
                      disabled={isSaving}
                      onClick={() => void handleSave(exercise.id)}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      disabled={isSaving}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="exercise-checkbox-label">
                    <input
                      type="checkbox"
                      checked={exercise.completed}
                      onChange={(event) => {
                        void onUpdateExercise(exercise.id, {
                          completed: event.target.checked,
                        }).catch((error) => {
                          window.alert(
                            error instanceof Error
                              ? error.message
                              : "Failed to update exercise.",
                          );
                        });
                      }}
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

                  <div className="exercise-actions">
                    <button type="button" onClick={() => handleEdit(exercise)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void onUpdateExercise(exercise.id, {
                          sets: exercise.sets + 1,
                        }).catch((error) => {
                          window.alert(
                            error instanceof Error
                              ? error.message
                              : "Failed to update exercise.",
                          );
                        });
                      }}
                    >
                      Add 1 Set
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(exercise.id)}
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
