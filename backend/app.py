from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json

# Add scripts directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.query_pinecone import query_pinecone, generate_answer_with_context

app = Flask(__name__)
CORS(app)

@app.route("/api/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        query = data.get("question", "").strip()
        if not query:
            return jsonify({"error": "Missing 'question'"}), 400

        print(f"\n🔍 Received question: {query}")

        # Step 1: Query Pinecone for matches + context
        results = query_pinecone(query)
        matches = results.get("matches", [])
        context = results.get("context", "")

        # Step 2: Generate answer from top matches
        answer = generate_answer_with_context(query, matches)

        # Log for debugging
        print("\n🧠 Prompt context:\n", context[:500])
        print("\n💬 Answer:\n", answer)

        # Step 3: Return structured response
        return jsonify({
            "answer": answer,
            "sources": matches
        }), 200

    except Exception as e:
        print("❌ Server error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
