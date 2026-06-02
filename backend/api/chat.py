from fastapi import APIRouter
from schemas.chat import ChatRequest
from graph.agent import run_agent

router = APIRouter()


@router.post("/")
def chat(payload: ChatRequest):
    response = run_agent(user_id=payload.user_id, message=payload.message)

    return {"response": response}
