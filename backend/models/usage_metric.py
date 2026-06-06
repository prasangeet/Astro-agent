from datetime import UTC
from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String

from database import Base


class UsageMetric(Base):
    __tablename__ = "usage_metrics"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    request_id = Column(
        String,
        nullable=False,
        index=True,
    )

    user_id = Column(
        Integer,
        nullable=False,
        index=True,
    )

    model = Column(
        String,
        nullable=False,
    )

    prompt_tokens = Column(
        Integer,
        nullable=False,
        default=0,
    )

    completion_tokens = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_tokens = Column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
