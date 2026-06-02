from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from database import Base


class NatalChart(Base):
    __tablename__ = "natal_charts"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    birth_profile_id = Column(
        Integer, ForeignKey("birth_profiles.id"), nullable=False, unique=True
    )

    chart_data = Column(
        JSON,
        nullable=False,
    )

    birth_profile = relationship(
        "BirthProfile",
        back_populates="natal_chart",
    )
