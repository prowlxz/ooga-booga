
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models
from app.api.routes import workouts, exercises

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MONKEY LIFT API",
    description="Backend API for the MONKEY LIFT Workout Planner",
    version="1.0.0",
)

# Allow requests from the React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(
    workouts.router,
    prefix="/api/v1",
)

app.include_router(
    exercises.router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "message": "Welcome to MONKEY LIFT API!",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
