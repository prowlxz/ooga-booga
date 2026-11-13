
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="planned",
    )

    category = Column(String(50), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    exercises = relationship(
        "Exercise",
        back_populates="workout",
        cascade="all, delete-orphan",
    )
