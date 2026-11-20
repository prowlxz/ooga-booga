
from logging.config import fileConfig

from alembic import context

from app.database import Base, DATABASE_URL, engine

# Register our SQLAlchemy models.
from app.models.workout import Workout
from app.models.exercise import Exercise


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Make our models visible to Alembic.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without a database connection."""

    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations using our existing database engine."""

    with engine.connect() as connection:

        # Temporarily disable SQLite foreign-key enforcement
        # while Alembic rebuilds tables.
        if connection.dialect.name == "sqlite":
            connection.exec_driver_sql("PRAGMA foreign_keys=OFF")
            connection.commit()

        try:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
                render_as_batch=True,
            )

            with context.begin_transaction():
                context.run_migrations()

        finally:
            # Restore foreign-key enforcement.
            if connection.dialect.name == "sqlite":
                connection.exec_driver_sql("PRAGMA foreign_keys=ON")
                connection.commit()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
