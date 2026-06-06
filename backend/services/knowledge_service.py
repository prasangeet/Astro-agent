from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

from core.logging import logger


class KnowledgeService:
    _vectorstore = None

    @classmethod
    def load(cls):
        if cls._vectorstore:
            logger.info("Knowledge base already loaded")

            return cls._vectorstore

        logger.info("Loading knowledge base...")

        docs = []

        for file in Path("knowledge").glob("*.md"):
            logger.info(
                "Loading knowledge file: %s",
                file.name,
            )

            loaded_docs = TextLoader(str(file)).load()

            docs.extend(loaded_docs)

        logger.info(
            "Loaded %s knowledge documents",
            len(docs),
        )

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
        )

        chunks = splitter.split_documents(
            docs,
        )

        logger.info(
            "Created %s knowledge chunks",
            len(chunks),
        )

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        logger.info("Building FAISS vector store...")

        cls._vectorstore = FAISS.from_documents(
            chunks,
            embeddings,
        )

        logger.info("Knowledge base loaded successfully")

        return cls._vectorstore

    @classmethod
    def search(
        cls,
        query: str,
        k: int = 4,
    ):
        logger.info(
            "Knowledge search query='%s' k=%s",
            query,
            k,
        )

        vectorstore = cls.load()

        docs = vectorstore.similarity_search(
            query,
            k=k,
        )

        logger.info(
            "Knowledge search returned %s chunks",
            len(docs),
        )

        for i, doc in enumerate(docs):
            logger.info(
                "Chunk %s: %s",
                i + 1,
                doc.page_content[:200],
            )

        return [doc.page_content for doc in docs]
