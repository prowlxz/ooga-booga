// LESSON: RENDERING ARRAYS WITH MAP()

import type { Exercise } from '../types/workout';

type ExerciseListProps = {
  exercises: Exercise[];
};

function ExerciseList({ exercises }: ExerciseListProps) {

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

              {exercise.name} - {exercise.sets} sets ×{' '}
              {exercise.reps} reps

            </li>
          ))}
        </ul>

      )}
    </section>
  );
}

export default ExerciseList;