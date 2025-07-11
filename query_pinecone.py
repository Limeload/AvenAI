import os
from dotenv import load_dotenv
import openai
from pinecone import Pinecone

load_dotenv()

# Set up OpenAI and Pinecone API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not OPENAI_API_KEY or not PINECONE_API_KEY:
    raise ValueError("❌ Make sure both OPENAI_API_KEY and PINECONE_API_KEY are set in .env")

# Configure OpenAI client
openai.api_key = OPENAI_API_KEY

# Embed the query
def embed_query(query):
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    embedding = response.data[0].embedding
    return embedding

# Connect to Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(name="aven-index")  # Update with your actual index name

# Query Pinecone with the embedded query
def query_pinecone(query, top_k=5):
    vector = embed_query(query)
    result = index.query(vector=vector, top_k=top_k, include_metadata=True)
    return result

if __name__ == "__main__":
    user_query = input("❓ Enter your question: ")
    result = query_pinecone(user_query)

    print("\n🔎 Top Matches:")
    matches = getattr(result, "matches", [])

    if not matches:
        print("No results found.")
    else:
        for match in matches:
            score = getattr(match, "score", 0)
            metadata = getattr(match, "metadata", {})
            print(f"\n— Score: {score:.4f}")
            print(f"  Title: {metadata.get('title', '[No title]')}")
            print(f"  URL: {metadata.get('url', '[No URL]')}")
            print(f"  Text: {metadata.get('text', '')[:300]}...")
