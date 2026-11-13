
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Workout, Exercise
from app.schemas import ExerciseCreate, ExerciseUpdate, ExerciseResponse

router = APIRouter(
    prefix="/workouts/{workout_id}/exercises",
    tags=["Exercises"],
)


def get_workout_or_404(workout_id: int, db: Session):
    workout = db.query(Workout).filter(
        Workout.id == workout_id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found.",
        )

    return workout


@router.post(
    "/",
    response_model=ExerciseResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_exercise(
    workout_id: int,
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
):
    workout = get_workout_or_404(workout_id, db)

    duplicate = (
        db.query(Exercise)
        .filter(
            Exercise.workout_id == workout_id,
            Exercise.name.ilike(exercise_data.name.strip()),
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This exercise already exists in this workout.",
        )

    new_exercise = Exercise(
        name=exercise_data.name.strip(),
        sets=exercise_data.sets,
        reps=exercise_data.reps,
        notes=exercise_data.notes,
        workout_id=workout.id,
    )

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise


@router.patch(
    "/{exercise_id}",
    response_model=ExerciseResponse,
)
def update_exercise(
    workout_id: int,
    exercise_id: int,
    exercise_data: ExerciseUpdate,
    db: Session = Depends(get_db),
):
    workout = get_workout_or_404(workout_id, db)

    exercise = (
        db.query(Exercise)
        .filter(
            Exercise.id == exercise_id,
            Exercise.workout_id == workout.id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found.",
        )

    updates = exercise_data.model_dump(exclude_unset=True)

    if "name" in updates and updates["name"] is not None:
        cleaned_name = updates["name"].strip()

        duplicate = (
            db.query(Exercise)
            .filter(
                Exercise.workout_id == workout_id,
                Exercise.name.ilike(cleaned_name),
                Exercise.id != exercise_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This exercise already exists in this workout.",
            )

        updates["name"] = cleaned_name

    for field, value in updates.items():
        setattr(exercise, field, value)

    db.commit()
    db.refresh(exercise)

    return exercise


@router.delete("/{exercise_id}")
def delete_exercise(
    workout_id: int,
    exercise_id: int,
    db: Session = Depends(get_db),
):
    workout = get_workout_or_404(workout_id, db)

    exercise = (
        db.query(Exercise)
        .filter(
            Exercise.id == exercise_id,
            Exercise.workout_id == workout.id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found.",
        )

    db.delete(exercise)
    db.commit()

    return {"message": "Exercise deleted successfully."}
