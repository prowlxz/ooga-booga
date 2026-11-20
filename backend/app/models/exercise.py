
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    CheckConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    __table_args__ = (
        CheckConstraint(
            "length(trim(name)) > 0",
            name="ck_exercises_name_not_blank",
        ),
        CheckConstraint(
            "sets > 0",
            name="ck_exercises_sets_positive",
        ),
        CheckConstraint(
            "reps > 0",
            name="ck_exercises_reps_positive",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    sets = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=False)
    notes = Column(String(500), nullable=True)

    completed = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    workout_id = Column(
        Integer,
        ForeignKey("workouts.id", ondelete="CASCADE"),
        nullable=False,
    )

    workout = relationship(
        "Workout",
        back_populates="exercises",
    )
