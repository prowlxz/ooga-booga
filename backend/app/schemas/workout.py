
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.exercise import ExerciseResponse


WorkoutStatus = Literal["planned", "in-progress", "completed"]


class WorkoutBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    status: WorkoutStatus = "planned"


class WorkoutCreate(WorkoutBase):
    pass


class WorkoutUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    status: WorkoutStatus | None = None


class WorkoutResponse(WorkoutBase):
    id: int
    exercises: list[ExerciseResponse] = []

    model_config = ConfigDict(from_attributes=True)
