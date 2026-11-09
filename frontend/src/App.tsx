// LESSON: COMPONENT COMPOSITION AND STATE MANAGEMENT
// App connects our reusable components and workout hook.
import { useState } from "react";

import WorkoutForm from "./components/WorkoutForm";
import WorkoutCard from "./components/WorkoutCard";

import { useWorkouts } from "./hooks/useWorkouts";

function App() {

  // Store the currently selected workout filter.
const [filter, setFilter] = useState('all');
// Store the workout search text.
const [searchTerm, setSearchTerm] = useState('');
// Store the selected workout sorting option.
const [sortBy, setSortBy] = useState('newest');

  // Get workout data and functions from our custom hook.
  const {
  workouts,
  createWorkout,
  addExercise,
  updateExercise,
  deleteExercise,
  updateWorkout,
  updateWorkoutStatus,
  deleteWorkout,
} = useWorkouts();

// Calculate the total number of workouts.
const totalWorkouts = workouts.length;

// Calculate the number of completed workouts.
const completedWorkouts = workouts.filter(
  (workout) => workout.status === 'completed'
).length;

// Calculate the total number of exercises across all workouts.
const totalExercises = workouts.reduce(
  (total, workout) => total + workout.exercises.length,
  0
);

// Calculate the percentage of completed workouts.
const completionRate = totalWorkouts === 0
  ? 0
  : Math.round((completedWorkouts / totalWorkouts) * 100);

// Filter workouts based on their current status.
// Filter workouts by status AND search text.
// Filter workouts based on status and search text.
const filteredWorkouts = workouts.filter((workout) => {

  const matchesStatus =
    filter === 'all' || workout.status === filter;

  const matchesSearch =
    workout.name.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSearch;
});

// Sort the filtered workouts.
const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {

  if (sortBy === 'newest') {
    return b.id - a.id;
  }

  if (sortBy === 'alphabetical') {
    return a.name.localeCompare(b.name);
  }

  return 0;
});
  // ADAPTER FUNCTION:
  // Convert separate exercise values into an object.
  const handleAddExercise = (
  workoutId: number,
  name: string,
  sets: number,
  reps: number,
  notes: string
) => {
  addExercise(workoutId, {
    name,
    sets,
    reps,
    notes,
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

        {/* WORKOUT STATISTICS */}
<section className="dashboard-stats">
  <h2>Workout Statistics</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>Total Workouts</h3>
      <p>{totalWorkouts}</p>
    </div>

    <div className="stat-card">
      <h3>Completed Workouts</h3>
      <p>{completedWorkouts}</p>
    </div>

    <div className="stat-card">
      <h3>Total Exercises</h3>
      <p>{totalExercises}</p>
    </div>

    <div className="stat-card">
      <h3>Completion Rate</h3>
      <p>{completionRate}%</p>
    </div>

  </div>
  <div className="progress-container">
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${completionRate}%` }}
    ></div>
  </div>
</div>
</section>

        {/* WORKOUT CREATION FORM */}
        <WorkoutForm onCreateWorkout={createWorkout} />

        {/* WORKOUT LIST */}
        <section>

          <h2>My Workouts</h2>

          {/* WORKOUT SEARCH */}
<input
  type="text"
  placeholder="Search workouts..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>

{/* WORKOUT SORTING */}
<select
  value={sortBy}
  onChange={(event) => setSortBy(event.target.value)}
>
  <option value="newest">Newest First</option>
  <option value="alphabetical">Alphabetical (A-Z)</option>
</select>

          {/* WORKOUT FILTER BUTTONS */}
<div>
  <button onClick={() => setFilter('all')}>
    All
  </button>

  <button onClick={() => setFilter('planned')}>
    Planned
  </button>

  <button onClick={() => setFilter('in-progress')}>
    In Progress
  </button>

  <button onClick={() => setFilter('completed')}>
    Completed
  </button>
</div>

          {filteredWorkouts.length === 0 ? (

  <p>
    {searchTerm
      ? `No workouts found matching "${searchTerm}".`
      : 'No workouts found for this filter.'}
  </p>

) : (

  sortedWorkouts.map((workout) => (

              <WorkoutCard
  key={workout.id}
  workout={workout}
  onAddExercise={handleAddExercise}
  onUpdateExercise={updateExercise}
  onDeleteExercise={deleteExercise}
  onUpdateWorkout={updateWorkout}
  onUpdateWorkoutStatus={updateWorkoutStatus}
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