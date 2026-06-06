# tools/user.py

from langchain_core.tools import tool

from database import SessionLocal

from services.user_service import UserService


@tool
def user_tool(
    user_id: int,
):
    """
    Retrieve information about the current user.
    Useful when the assistant needs the user's name.
    """

    db = SessionLocal()

    try:
        user = UserService.get_user(
            db=db,
            user_id=user_id,
            request_id="tool",
        )

        if not user:
            return {
                "error": "User not found",
            }

        return {
            "id": user.id,
            "name": user.name,
        }

    finally:
        db.close()
