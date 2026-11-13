
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Workout
from app.schemas import WorkoutCreate, WorkoutUpdate, WorkoutResponse

router = APIRouter(
    prefix="/workouts",
    tags=["Workouts"],
)


@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(db: Session = Depends(get_db)):
    return db.query(Workout).all()


@router.post(
    "/",
    response_model=WorkoutResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_workout(
    workout_data: WorkoutCreate,
    db: Session = Depends(get_db),
):
    duplicate = (
        db.query(Workout)
        .filter(Workout.name.ilike(workout_data.name))
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A workout with this name already exists.",
        )

    new_workout = Workout(
        name=workout_data.name.strip(),
        category=workout_data.category.strip(),
        status=workout_data.status,
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout


@router.patch("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    workout_data: WorkoutUpdate,
    db: Session = Depends(get_db),
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found.",
        )

    updates = workout_data.model_dump(exclude_unset=True)

    if "name" in updates and updates["name"] is not None:
        cleaned_name = updates["name"].strip()

        duplicate = (
            db.query(Workout)
            .filter(
                Workout.name.ilike(cleaned_name),
                Workout.id != workout_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A workout with this name already exists.",
            )

        updates["name"] = cleaned_name

    for field, value in updates.items():
        setattr(workout, field, value)

    db.commit()
    db.refresh(workout)

    return workout


@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found.",
        )

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted successfully."}
