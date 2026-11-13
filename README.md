# MONKEY LIFT

A full-stack workout planner application that helps users organize workouts, manage exercises, and track workout progress.

## Features

- Create and manage workouts
- Organize workouts by category
- Track workout status: Planned, In Progress, and Completed
- Add exercises to workouts
- Edit exercise details, including sets, reps, and notes
- Mark exercises as completed
- Delete exercises and workouts
- Persistent database storage
- Responsive React frontend
- RESTful API powered by FastAPI

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### Development and Deployment
- Docker
- Docker Compose
- Nginx

## Project Structure

```text
ooga_booga/
├── backend/
│   ├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── monkey_lift.db
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Docker Desktop
- Git

### Run with Docker Compose

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate into the project:

```bash
cd ooga_booga
```

3. Build the application:

```bash
docker compose build
```

4. Start the containers:

```bash
docker compose up -d
```

5. Check container status:

```bash
docker compose ps
```

## Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Backend Health Check | http://localhost:8000/health |

## API Endpoints

### Workouts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/workouts/` | Retrieve all workouts |
| POST | `/api/v1/workouts/` | Create a workout |
| PATCH | `/api/v1/workouts/{workout_id}` | Update a workout |
| DELETE | `/api/v1/workouts/{workout_id}` | Delete a workout |

### Exercises

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/workouts/{workout_id}/exercises/` | Add an exercise |
| PATCH | `/api/v1/workouts/{workout_id}/exercises/{exercise_id}` | Update an exercise |
| DELETE | `/api/v1/workouts/{workout_id}/exercises/{exercise_id}` | Delete an exercise |

## Stop the Application

To stop the containers:

```bash
docker compose down
```

To stop and rebuild after code changes:

```bash
docker compose up -d --build
```

## Database

MONKEY LIFT uses SQLite with SQLAlchemy for database operations.

The SQLite database is stored in the backend directory and mounted into the Docker container to preserve data between container restarts.

## License

This project is developed for educational and personal use.
