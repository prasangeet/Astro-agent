# tools/knowledge.py

from langchain_core.tools import tool

from services.knowledge_service import (
    KnowledgeService,
)


@tool
def knowledge_search_tool(
    query: str,
):
    """
    Search the astrology knowledge base.
    Use for astrology concepts, meanings,
    houses, planets, aspects, and transits.
    """

    return KnowledgeService.search(
        query=query,
    )
