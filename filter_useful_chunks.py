import json
import os

# Load data
with open("data/aven_exa_data.json", "r", encoding="utf-8") as f:
    documents = json.load(f)

# Define keyword patterns (you can refine over time)
useful_keywords = [
    "how", "why", "what", "steps", "apply", "activate", "rate", "fee",
    "eligibility", "credit score", "cash out", "balance transfer", "rewards"
]

repetitive_keywords = [
    "footer", "home", "cookie", "apply now", "aven is", "disclaimer",
    "copyright", "terms", "navbar"
]

# Scoring function
def score_text(text):
    score = 0
    for kw in useful_keywords:
        if kw in text.lower():
            score += 1
    for kw in repetitive_keywords:
        if kw in text.lower():
            score -= 1
    return score

# Tag and filter
tagged = []
for doc in documents:
    score = score_text(doc["text"])
    doc["tag"] = "useful" if score >= 1 else "repetitive"
    tagged.append(doc)

# Save both versions
os.makedirs("data", exist_ok=True)

with open("data/aven_tagged_data.json", "w", encoding="utf-8") as f:
    json.dump(tagged, f, indent=2)

with open("data/aven_useful_data.json", "w", encoding="utf-8") as f:
    json.dump([d for d in tagged if d["tag"] == "useful"], f, indent=2)

print(f"✅ Filtered {len(tagged)} documents — {len([d for d in tagged if d['tag'] == 'useful'])} marked useful.")
