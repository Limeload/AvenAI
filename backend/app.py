from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add 'scripts' to the import path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.query_pinecone import query_pinecone

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (customize for production)

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/api/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        query = data.get("question", "")
        if not query:
            return jsonify({"error": "Missing 'question'"}), 400

        result = query_pinecone(query)
        context = result["context"]
        matches = result["matches"]

        # Use OpenAI Chat API to generate an answer
        prompt = f"""You are Aven's helpful support bot. Use the following context to answer the user's question:

        Context:
        {context}

        Question:
        {query}

        Answer:"""

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or "gpt-4" if enabled
            messages=[{"role": "user", "content": prompt}]
        )

        content = completion.choices[0].message.content
        answer = content.strip() if content else "No response generated."

        return jsonify({
            "answer": answer,
            "matches": matches
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
