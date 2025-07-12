import os
from dotenv import load_dotenv
import openai
from pinecone import Pinecone

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not OPENAI_API_KEY or not PINECONE_API_KEY:
    raise ValueError("❌ Missing keys in .env")

# OpenAI setup
openai.api_key = OPENAI_API_KEY

def embed_query(query):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding

# Pinecone setup
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("aven-index") 

def query_pinecone(query, top_k=5):
    try:
        vector = embed_query(query)
        result = index.query(vector=vector, top_k=top_k, include_metadata=True)
        return result
    except Exception as e:
        print(f"Error querying Pinecone: {e}")
        raise