# rag/retriever.py


def retrieve(query: str) -> str:
    with open(
        "data/astrology_notes.md",
        "r",
        encoding="utf-8",
    ) as f:
        text = f.read()

    return text
