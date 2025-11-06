# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env

app = Flask(__name__)
CORS(app)

# NEW 2025 ENDPOINT
API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
API_TOKEN = os.getenv("HF_TOKEN")  # From .env

headers = {"Authorization": f"Bearer {API_TOKEN}"}

LENGTH_CONFIG = {
    "short": {"max_length": 80, "min_length": 30},
    "medium": {"max_length": 150, "min_length": 50},
    "long": {"max_length": 250, "min_length": 100}
}

def extract_text_from_pdf(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"PDF error: {e}")
        return ""

def clean_text(text):
    return " ".join(text.split()).strip()

@app.route("/")
def home():
    return jsonify({"message": "AI Summarizer API is running!"})

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        text_input = request.form.get("text", "").strip()
        file = request.files.get("file")
        length = request.form.get("length", "medium").lower()

        if not text_input and not file:
            return jsonify({"error": "No text or file provided"}), 400

        if file:
            if not file.filename.lower().endswith(('.txt', '.pdf')):
                return jsonify({"error": "Only .txt or .pdf allowed"}), 400
            if file.filename.endswith('.pdf'):
                text_input = extract_text_from_pdf(file)
            else:
                text_input = file.read().decode("utf-8", errors="ignore")

        if not text_input.strip():
            return jsonify({"error": "Empty content"}), 400

        text_input = clean_text(text_input)
        if len(text_input.split()) > 1000:
            text_input = " ".join(text_input.split()[:1000])

        config = LENGTH_CONFIG.get(length, LENGTH_CONFIG["medium"])
        payload = {
            "inputs": text_input,
            "parameters": config
        }

        for attempt in range(3):
            response = requests.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                summary = response.json()[0]["summary_text"]
                return jsonify({"summary": summary})
            elif "loading" in response.text.lower():
                time.sleep(5)
                continue
            else:
                return jsonify({"error": f"API error: {response.status_code} - {response.text}"}), 500

        return jsonify({"error": "Model loading timeout"}), 503

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)