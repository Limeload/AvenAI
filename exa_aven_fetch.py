from exa_py import Exa
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Set your API key
exa = Exa(os.getenv('EXA_API_KEY'))
# Create a list of search queries matching real Aven pages
queries = [
    "site:aven.com support",
    "site:aven.com how it works",
    "site:aven.com what is the aven card",
    "site:aven.com cashback rewards",
    "site:aven.com disclosures",
    "site:aven.com terms of service",
    "site:aven.com privacy policy",
    "site:aven.com pay it forward referral",
    "site:aven.com education heloc",
    "site:aven.com education credit score",
    "site:aven.com heloc rental property",
    "site:aven.com education get aven card",
    "site:aven.com contact",
    "site:aven.com education lowest heloc rates",
    "site:aven.com education what is a heloc",
    "site:aven.com education fastest heloc card",
    "site:aven.com can you get cash from aven card"
]

# Prepare output folder
os.makedirs("data", exist_ok=True)

# Store all content in this list
all_documents = []

# Run Exa search and content fetch for each query
for i, query in enumerate(queries):
    print(f"🔍 Querying Exa.ai for: {query}")
    results = exa.search_and_contents(query=query, num_results=5)

    for r in results.results:
        doc = {
            "title": r.title,
            "url": r.url,
            "text": r.text.strip() if r.text else ""
        }
        all_documents.append(doc)

# Save all documents to a single JSON file
with open("data/aven_exa_data.json", "w", encoding="utf-8") as f:
    json.dump(all_documents, f, indent=2)

print(f"✅ Saved {len(all_documents)} documents to data/aven_exa_data.json")
