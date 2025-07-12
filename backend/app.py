from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

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

        matches = query_pinecone(query)

        print("📦 Flask received matches:")
        for match in matches:
            print(" -", match)

        return jsonify({"matches": matches}), 200

    except Exception as e:
        print("❌ Flask error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
