from dotenv import load_dotenv
from langchain_groq import ChatGroq
from database import Base

load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.2,
)

response = llm.invoke(
    "You are an astrology assistant. What information do you need before generating a birth chart?"
)

print(response.content)
