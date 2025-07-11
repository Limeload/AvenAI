import os
import json
import time
import openai
from tqdm import tqdm
from dotenv import load_dotenv

# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Constants
MODEL = "text-embedding-3-small"
BATCH_SIZE = 20
INPUT_FILE = "data/aven_chunks.json"
OUTPUT_FILE = "data/aven_chunks_with_embeddings.json"

# Load input chunks
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    chunks = json.load(f)

# Split into batches
def batch_chunks(chunks, batch_size):
    for i in range(0, len(chunks), batch_size):
        yield chunks[i:i + batch_size]

embedded_chunks = []

for batch in tqdm(list(batch_chunks(chunks, BATCH_SIZE)), desc="Embedding batches"):
    texts = [str(chunk["text"]) for chunk in batch if chunk.get("text")]
    if not texts:
        continue  # skip empty batch

    try:
        response = openai.embeddings.create(
            model=MODEL,
            input=texts
        )

        # Assign embeddings to each chunk
        for i, result in enumerate(response.data):
            batch[i]["embedding"] = result.embedding
            embedded_chunks.append(batch[i])

    except openai.OpenAIError as e:
        print(f"❌ OpenAI error: {e}")
        continue
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        continue

# Save embedded data
os.makedirs("data", exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(embedded_chunks, f, indent=2)

print(f"\n✅ Embedded {len(embedded_chunks)} chunks. Output saved to {OUTPUT_FILE}")
