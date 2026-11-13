
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

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
