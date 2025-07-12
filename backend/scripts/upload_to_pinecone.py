import os
import json
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Pinecone API client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Config
INDEX_NAME = "aven-index"
DIMENSIONS = 1536

# Create index if not exists
if INDEX_NAME not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=INDEX_NAME,
        dimension=DIMENSIONS,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print(f"✅ Created index: {INDEX_NAME}")
else:
    print(f"ℹ️ Index already exists: {INDEX_NAME}")

# Connect to index
index = pc.Index(INDEX_NAME)

# Load data with embeddings
with open("data/aven_chunks_with_embeddings.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Prepare vector data for upsert
def prepare_vector(item, idx):
    return (
        f"aven-chunk-{idx}",      # id
        item["embedding"],        # values
        {
            "text": item["text"],
            "url": item.get("url", ""),
            "title": item.get("title", "")
        }    # metadata
    )
# Upsert in batches
batch_size = 100
for i in range(0, len(data), batch_size):
    batch = data[i:i + batch_size]
    vectors = [prepare_vector(item, i + j) for j, item in enumerate(batch)]
    index.upsert(vectors=vectors)
    print(f"⬆️ Uploaded batch {i // batch_size + 1}")

print("✅ All vectors uploaded to Pinecone!")