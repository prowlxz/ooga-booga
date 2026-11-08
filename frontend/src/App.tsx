// LESSON: COMPONENT COMPOSITION AND STATE MANAGEMENT
// App connects our reusable components and workout hook.

import WorkoutForm from "./components/WorkoutForm";
import WorkoutCard from "./components/WorkoutCard";

import { useWorkouts } from "./hooks/useWorkouts";

function App() {

  // Get workout data and functions from our custom hook.
  const {
    workouts,
    createWorkout,
    addExercise,
    updateWorkout,
    deleteWorkout,
  } = useWorkouts();
    // ADAPTER FUNCTION:
  // WorkoutCard sends separate values, but our hook expects an object.
  // This function converts those values into the format the hook needs.
  const handleAddExercise = (
    workoutId: number,
    name: string,
    sets: number,
    reps: number
  ) => {
    addExercise(workoutId, {
      name,
      sets,
      reps,
    });
  };

  return (
    <div>

      {/* APPLICATION HEADER */}
      <header>
        <h1>Workout Planner</h1>
        <p>Your personal fitness companion.</p>
      </header>

      <main>

        {/* WELCOME SECTION */}
        <section>
          <h2>Welcome!</h2>
          <p>Create workouts and organize your exercises.</p>
        </section>

        {/* WORKOUT CREATION FORM */}
        <WorkoutForm onCreateWorkout={createWorkout} />

        {/* WORKOUT LIST */}
        <section>

          <h2>My Workouts</h2>

          {workouts.length === 0 ? (

            <p>No workouts created yet.</p>

          ) : (

            workouts.map((workout) => (

              <WorkoutCard
                key={workout.id}
                workout={workout}

                onAddExercise={handleAddExercise}

                onUpdateWorkout={updateWorkout}

                onDeleteWorkout={deleteWorkout}
              />

            ))

          )}

        </section>

      </main>

    </div>
  );
}

export default App;