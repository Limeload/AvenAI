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
    print("📡 Generating embedding...")
    response = openai.embeddings.create(
        model="text-embedding-3-small",  
        input=query
    )
    return response.data[0].embedding

# Pinecone setup
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("aven-index")

# Debug: Print index stats
def check_index():
    stats = index.describe_index_stats()
    print("📦 Pinecone Index Stats:")
    print(f"  - Total vectors: {stats.get('total_vector_count')}")
    print(f"  - Namespaces: {list(stats.get('namespaces', {}).keys())}\n")

def query_pinecone(query, top_k=5):
    vector = embed_query(query)
    response = index.query(vector=vector, top_k=top_k, include_metadata=True)
    matches = getattr(response, "matches", [])

    context = "\n".join([match.metadata.get("text", "") for match in matches])
    return {
        "context": context,
        "matches": [
            {
                "score": match.score,
                "title": match.metadata.get("title", "Untitled"),
                "url": match.metadata.get("url", ""),
                "text": match.metadata.get("text", "")[:300] + "..."
            }
            for match in matches
        ]
    }

def generate_answer_with_context(query, matches):
    """
    Generate a concise answer using the query and matched documents.
    """
    context_texts = [
        match["metadata"].get("text", "") for match in matches if "metadata" in match
    ]
    context = "\n\n".join(context_texts[:3])  # Take top 3 matches max

    messages = [
        {"role": "system", "content": "You are a helpful support assistant for Aven."},
        {"role": "user", "content": f"Answer the question based on the context below:\n\n{context}\n\nQuestion: {query}"}
    ]

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # You can switch to gpt-4 if needed
            messages=messages,  # type: ignore
            temperature=0.3
        )
        content = response.choices[0].message.content
        return content.strip() if content else "No response generated."
    except Exception as e:
        print("❌ Error generating answer:", e)
        return "Sorry, I couldn't generate an answer right now."
