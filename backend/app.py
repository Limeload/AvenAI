from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json

# Add 'scripts' to the import path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.query_pinecone import query_pinecone

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (customize for production)

@app.route("/api/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        query = data.get("question", "")
        if not query:
            return jsonify({"error": "Missing 'question'"}), 400

        result = query_pinecone(query)
        matches = getattr(result, "matches", [])

        # Format results safely
        formatted_matches = []
        for match in matches:
            formatted_matches.append({
                "score": getattr(match, "score", 0),
                "id": getattr(match, "id", ""),
                "metadata": getattr(match, "metadata", {})
            })

        return jsonify({"matches": formatted_matches}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
