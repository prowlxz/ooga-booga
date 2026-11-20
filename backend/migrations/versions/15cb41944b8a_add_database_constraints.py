
"""add database constraints

Revision ID: 15cb41944b8a
Revises:
Create Date: 2026-11-20 23:30:22.783696
"""

from typing import Sequence, Union

from alembic import op


# Revision identifiers.
revision: str = "15cb41944b8a"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add database constraints."""

    # Rebuild the exercises table with its new constraints.
    with op.batch_alter_table(
        "exercises",
        recreate="always",
    ) as batch_op:

        batch_op.create_check_constraint(
            "ck_exercises_name_not_blank",
            "length(trim(name)) > 0",
        )

        batch_op.create_check_constraint(
            "ck_exercises_sets_positive",
            "sets > 0",
        )

        batch_op.create_check_constraint(
            "ck_exercises_reps_positive",
            "reps > 0",
        )

    # Rebuild the workouts table with its new constraints.
    with op.batch_alter_table(
        "workouts",
        recreate="always",
    ) as batch_op:

        batch_op.create_check_constraint(
            "ck_workouts_name_not_blank",
            "length(trim(name)) > 0",
        )

        batch_op.create_check_constraint(
            "ck_workouts_status_valid",
            "status IN ('planned', 'in-progress', 'completed')",
        )


def downgrade() -> None:
    """Remove the database constraints."""

    # Remove workout constraints.
    with op.batch_alter_table(
        "workouts",
        recreate="always",
    ) as batch_op:

        batch_op.drop_constraint(
            "ck_workouts_status_valid",
            type_="check",
        )

        batch_op.drop_constraint(
            "ck_workouts_name_not_blank",
            type_="check",
        )

    # Remove exercise constraints.
    with op.batch_alter_table(
        "exercises",
        recreate="always",
    ) as batch_op:

        batch_op.drop_constraint(
            "ck_exercises_reps_positive",
            type_="check",
        )

        batch_op.drop_constraint(
            "ck_exercises_sets_positive",
            type_="check",
        )

        batch_op.drop_constraint(
            "ck_exercises_name_not_blank",
            type_="check",
        )
