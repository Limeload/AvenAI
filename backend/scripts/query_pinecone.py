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
    try:
        check_index()

        vector = embed_query(query)
        result = index.query(vector=vector, top_k=top_k, include_metadata=True)
        metadata_list = getattr(result, "matches", [])

        print(f"🔍 Found {len(metadata_list)} results\n")

        if not metadata_list:
            print("⚠️ No matches found. Try changing the query or check your index data.")
            return []

        # Debug: Show first result metadata
        if metadata_list:
            print("🔍 Debug - First result metadata:")
            first_item = metadata_list[0]
            print(f"  - Item type: {type(first_item)}")
            print(f"  - Item content: {first_item}")
            if hasattr(first_item, 'metadata'):
                print(f"  - Metadata: {first_item.metadata}")
            print()

        seen_urls = set()
        unique = []
        for item in metadata_list:
            meta = item.metadata or {}
            url = meta.get("url", "").strip()

            if url and url not in seen_urls:
               seen_urls.add(url)
               unique.append({
                   "title": meta.get("title", "No Title"),
                   "url": url,
                   "description": meta.get("text", "No Description")
                })

        if not unique:
            print("⚠️ No unique results to display (possibly all duplicates).")
            return []

        for i, chunk in enumerate(unique, 1):
            print(f"Result #{i}")
            print(f"Title      : {chunk['title']}")
            print(f"URL        : {chunk['url']}")
            print(f"Description: {chunk['description']}")
            print("-" * 50)

        return unique

    except Exception as e:
        print(f"❌ Error querying Pinecone: {e}")
        raise


    
   
