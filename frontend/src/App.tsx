// LESSON: COMPONENT COMPOSITION AND STATE MANAGEMENT
// App connects our reusable components and workout hook.

import { useCallback, useMemo, useState } from "react";
import "./styles/index.css";

import WorkoutForm from "./components/WorkoutForm";
import WorkoutCard from "./components/WorkoutCard";

import { useWorkouts } from "./hooks/useWorkouts";

function App() {
  // Store the currently selected workout filter.
  const [filter, setFilter] = useState("all");

  // Store the workout search text.
  const [searchTerm, setSearchTerm] = useState("");

  // Store the selected workout sorting option.
  const [sortBy, setSortBy] = useState("newest");

  // Store the selected workout category filter.
  const [categoryFilter, setCategoryFilter] = useState("all");

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
    (workout) => workout.status === "completed",
  ).length;

  // Calculate the total number of exercises.
  const totalExercises = workouts.reduce(
    (total, workout) => total + workout.exercises.length,
    0,
  );

  // Calculate the percentage of completed workouts.
  const completionRate =
    totalWorkouts === 0
      ? 0
      : Math.round((completedWorkouts / totalWorkouts) * 100);

  // Remember the filtered workouts until a dependency changes.
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesStatus = filter === "all" || workout.status === filter;

      const matchesSearch = workout.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || workout.category === categoryFilter;

      return matchesStatus && matchesSearch && matchesCategory;
    });
  }, [workouts, filter, searchTerm, categoryFilter]);

  // Remember the sorted workouts until a dependency changes.
  const sortedWorkouts = useMemo(() => {
    return [...filteredWorkouts].sort((a, b) => {
      if (sortBy === "newest") {
        return b.id - a.id;
      }

      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });
  }, [filteredWorkouts, sortBy]);

  // Remember this function until addExercise changes.
  const handleAddExercise = useCallback(
    (
      workoutId: number,
      name: string,
      sets: number,
      reps: number,
      notes: string,
    ) => {
      addExercise(workoutId, {
        name,
        sets,
        reps,
        notes,
      });
    },
    [addExercise],
  );

  // Remember this function until createWorkout changes.
  const handleCreateWorkout = useCallback(
    (name: string, category: string) => {
      return createWorkout(name, category);
    },
    [createWorkout],
  );

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        {/* SIDEBAR BRAND */}
        <div className="sidebar-brand">MONKEY LIFT</div>

        {/* MAIN NAVIGATION */}
        <nav className="sidebar-navigation">
          <a href="#dashboard" className="sidebar-link active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="#clients" className="sidebar-link">
            <span>♙</span>
            Clients
          </a>

          <a href="#groups" className="sidebar-link">
            <span>♧</span>
            Groups
          </a>

          <a href="#templates" className="sidebar-link">
            <span>▤</span>
            Templates
          </a>

          <a href="#calendar" className="sidebar-link">
            <span>▦</span>
            Calendar
          </a>

          <a href="#chats" className="sidebar-link">
            <span>✉</span>
            Chats
          </a>

          <a href="#help" className="sidebar-link">
            <span>?</span>
            Help
          </a>
        </nav>

        {/* BOTTOM NAVIGATION */}
        <div className="sidebar-bottom">
          <a href="#settings" className="sidebar-link">
            <span>⚙</span>
            Settings
          </a>

          <a href="#logout" className="sidebar-link">
            <span>↪</span>
            Log Out
          </a>
        </div>
      </aside>

      {/* MAIN APPLICATION CONTENT */}
      <div className="app-content">
        {/* APPLICATION TOP NAVIGATION */}
        <header className="app-header">
          {/* HEADER SEARCH */}
          <div className="header-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {/* HEADER ACTIONS */}
          <div className="header-actions">
            <button type="button" className="header-icon-button">
              ♧
            </button>

            <button type="button" className="header-icon-button">
              ✉
            </button>

            <span className="header-user">My Profile</span>

            <div className="profile-avatar">M</div>
          </div>
        </header>

        <main>
          {/* DASHBOARD PAGE HEADING */}
          <section className="dashboard-heading">
            <div className="dashboard-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span>Workout Planner</span>
            </div>

            <div className="dashboard-heading-content">
              <div>
                <h2>My Workout Dashboard</h2>
                <p>Plan, organize, and track your fitness journey.</p>
              </div>

              <div className="dashboard-heading-actions">
                <span className="dashboard-date">YOUR FITNESS WORKSPACE</span>
              </div>
            </div>
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
          <WorkoutForm onCreateWorkout={handleCreateWorkout} />

          {/* WORKOUT LIST */}
          <section className="workout-list-section">
            <h2>My Workouts</h2>

            {/* WORKOUT FILTER TOOLBAR */}
            <div className="workout-toolbar">
              {/* WORKOUT SEARCH */}
              <div className="workout-toolbar-search">
                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              {/* SORTING AND CATEGORY FILTERS */}
              <div className="workout-toolbar-selects">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Recovery">Recovery</option>
                </select>
              </div>

              {/* WORKOUT STATUS FILTERS */}
              <div className="workout-toolbar-filters">
                <button
                  type="button"
                  className={
                    filter === "all" ? "filter-button active" : "filter-button"
                  }
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  type="button"
                  className={
                    filter === "planned"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("planned")}
                >
                  Planned
                </button>

                <button
                  type="button"
                  className={
                    filter === "in-progress"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("in-progress")}
                >
                  In Progress
                </button>

                <button
                  type="button"
                  className={
                    filter === "completed"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* DISPLAY FILTERED WORKOUTS */}
            {filteredWorkouts.length === 0 ? (
              <p>
                {searchTerm.trim() !== ""
                  ? `No workouts found matching "${searchTerm}".`
                  : categoryFilter !== "all" && filter !== "all"
                    ? `No ${categoryFilter} workouts found with ${
                        filter === "in-progress" ? "In Progress" : filter
                      } status.`
                    : categoryFilter !== "all"
                      ? `No ${categoryFilter} workouts found.`
                      : filter !== "all"
                        ? `No ${
                            filter === "in-progress" ? "In Progress" : filter
                          } workouts found.`
                        : "No workouts available yet."}
              </p>
            ) : (
              <div className="workout-board">
                {/* HORIZONTAL WORKOUT BOARD */}
                {sortedWorkouts.map((workout) => (
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
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
