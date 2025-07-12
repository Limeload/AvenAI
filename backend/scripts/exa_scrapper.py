import os
import json
from exa_py import Exa
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Key from .env
EXA_API_KEY = os.getenv("EXA_API_KEY")
if not EXA_API_KEY:
    raise ValueError("❌ Missing EXA_API_KEY in .env file")

# Exa client
exa = Exa(api_key=EXA_API_KEY)

# Query for Aven support content
search_query = "site:aven.com support"
results = exa.search_and_contents(
    search_query,
    num_results=25,
    use_autoprompt=True,
    text=True
)

# Convert to simplified JSON format
data = []
for i, r in enumerate(results.results):
    data.append({
        "id": f"aven-{i}",
        "url": r.url,
        "title": r.title,
        "text": r.text or ""
    })

# Save to data/aven_exa_data.json
os.makedirs("data", exist_ok=True)
with open("data/aven_exa_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"✅ Scraped and saved {len(data)} results to data/aven_exa_data.json")
