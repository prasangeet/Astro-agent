from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Time

from sqlalchemy.orm import relationship

from database import Base


class BirthProfile(Base):
    __tablename__ = "birth_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="birth_profiles",
    )

    date = Column(
        Date,
        nullable=False,
    )

    time = Column(
        Time,
        nullable=False,
    )

    place = Column(
        String,
        nullable=False,
    )

    latitude = Column(
        Float,
        nullable=False,
    )

    longitude = Column(
        Float,
        nullable=False,
    )

    timezone = Column(
        String,
        nullable=False,
    )

    natal_chart = relationship(
        "NatalChart",
        back_populates="birth_profile",
        uselist=False,
        cascade="all, delete-orphan",
    )
