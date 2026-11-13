
from pydantic import BaseModel, ConfigDict, Field


class ExerciseBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    sets: int = Field(ge=1)
    reps: int = Field(ge=1)
    notes: str | None = Field(default=None, max_length=500)


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    sets: int | None = Field(default=None, ge=1)
    reps: int | None = Field(default=None, ge=1)
    notes: str | None = Field(default=None, max_length=500)
    completed: bool | None = None


class ExerciseResponse(ExerciseBase):
    id: int
    completed: bool

    model_config = ConfigDict(from_attributes=True)
