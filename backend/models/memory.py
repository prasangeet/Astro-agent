# models/memory.py

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text

from database import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
    )

    summary = Column(
        Text,
        nullable=False,
        default="",
    )
