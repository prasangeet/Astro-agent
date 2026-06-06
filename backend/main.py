from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base
from database import engine

from services.knowledge_service import KnowledgeService

from api.health import router as health_router
from api.chat import router as chat_router
from api.user import router as user_router
from api.birth_profile import router as birth_profile_router
from api.chart import router as natal_router

from models.user import User
from models.birth_profile import BirthProfile
from models.natal_chart import NatalChart
from models.conversation import Conversation

app = FastAPI(title="AstroAgent")


@app.on_event("startup")
def startup():
    KnowledgeService.load()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"],
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"],
)

app.include_router(
    user_router,
    prefix="/users",
    tags=["User"],
)

app.include_router(
    birth_profile_router,
    prefix="/birth-profiles",
    tags=["BirthProfile"],
)

app.include_router(
    natal_router,
    prefix="/natal-charts",
    tags=["NatalChart"],
)
