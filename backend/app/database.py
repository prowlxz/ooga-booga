
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database location
DATABASE_URL = "sqlite:///./monkey_lift.db"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


# Enable foreign-key enforcement for every SQLite connection.
@event.listens_for(engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()

    cursor.execute("PRAGMA foreign_keys=ON")

    cursor.close()


# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for database models
Base = declarative_base()


# Database dependency for API routes
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()