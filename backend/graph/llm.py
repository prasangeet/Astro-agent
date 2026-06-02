from dotenv import load_dotenv

from langchain_groq import ChatGroq

from tools.registry import TOOLS

load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.2,
)

llm_with_tools = llm.bind_tools(TOOLS)
