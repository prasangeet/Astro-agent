from fastapi import FastAPI

from database import Base
from database import engine
from api.health import router as health_router
from api.chat import router as chat_router
from api.user import router as user_router
from api.birth_chart import router as birth_chart_router

from models.user import User
from models.birth_profile import BirthProfile
from models.natal_chart import NatalChart
from models.conversation import Conversation

app = FastAPI(title="AstroAgent")

Base.metadata.create_all(bind=engine)

app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(user_router, prefix="/users", tags=["User"])
app.include_router(birth_chart_router, prefix="/birth-chart", tags=["BirthChart"])
