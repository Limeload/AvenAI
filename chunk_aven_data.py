import json
import tiktoken
import os
import uuid

INPUT_FILE = "data/aven_useful_data.json"
OUTPUT_FILE = "data/aven_chunks.json"

# Use tokenizer for embedding model
tokenizer = tiktoken.encoding_for_model("text-embedding-3-small")

def count_tokens(text):
    return len(tokenizer.encode(text))

def chunk_text(text, max_tokens=500, overlap_tokens=50):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    chunks = []
    current_chunk = []
    current_tokens = 0

    for line in lines:
        tokens = len(tokenizer.encode(line))
        if current_tokens + tokens > max_tokens:
            # Save current chunk
            chunks.append(" ".join(current_chunk))
            # Start new chunk with overlap (last few lines)
            current_chunk = current_chunk[-2:]  # overlap 2 lines
            current_tokens = sum(len(tokenizer.encode(l)) for l in current_chunk)

        current_chunk.append(line)
        current_tokens += tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

# Load your filtered, useful Aven support data
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

chunked_data = []

for doc in data:
    chunks = chunk_text(doc["text"])
    for i, chunk in enumerate(chunks):
        chunked_data.append({
            "id": str(uuid.uuid4()),
            "title": doc["title"],
            "url": doc["url"],
            "tag": doc.get("tag", "useful"),
            "chunk_index": i,
            "text": chunk
        })

# Save output
os.makedirs("data", exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(chunked_data, f, indent=2)

print(f"✅ Chunked {len(data)} documents into {len(chunked_data)} chunks. Saved to {OUTPUT_FILE}")
