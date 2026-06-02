from langchain_core.tools import tool

from rag.retriever import retrieve


@tool
def knowledge_lookup_tool(
    query: str,
):
    """
    Lookup astrology reference material.
    """

    return retrieve(query)
