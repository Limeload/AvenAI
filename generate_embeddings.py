import os
import json
import openai
from tqdm import tqdm
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Constants
MODEL = "text-embedding-3-small"
BATCH_SIZE = 20
INPUT_FILE = "data/aven_chunks.json"
OUTPUT_FILE = "data/aven_chunks_with_embeddings.json"

# Load chunks from JSON
try:
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)
except FileNotFoundError:
    print(f"❌ Input file not found: {INPUT_FILE}")
    exit(1)

# Utility: Batch generator
def batch_chunks(data, size):
    for i in range(0, len(data), size):
        yield data[i:i + size]

embedded_chunks = []

# Process batches
for batch in tqdm(list(batch_chunks(chunks, BATCH_SIZE)), desc="🔁 Embedding batches"):
    texts = [chunk.get("text", "").strip() for chunk in batch if chunk.get("text", "").strip()]
    if not texts:
        continue  # Skip empty batches

    try:
        response = openai.embeddings.create(
            model=MODEL,
            input=texts
        )

        for i, result in enumerate(response.data):
            chunk = batch[i]
            chunk["embedding"] = result.embedding
            embedded_chunks.append(chunk)

    except openai.OpenAIError as e:
        print(f"❌ OpenAI API error: {e}")
        continue
    except Exception as e:
        print(f"❌ General error: {e}")
        continue

# Save output
os.makedirs("data", exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(embedded_chunks, f, indent=2, ensure_ascii=False)

print(f"\n✅ Embedded {len(embedded_chunks)} chunks saved to: {OUTPUT_FILE}")
