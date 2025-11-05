from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
import PyPDF2

app = Flask(__name__)
CORS(app)

# Initialize Hugging Face summarization pipeline with a lighter model
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.txt'):
            text = file.read().decode('utf-8')
        elif file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(file)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text() or ''
        else:
            return jsonify({'error': 'Unsupported file type. Use TXT or PDF.'}), 400
    else:
        data = request.json
        text = data.get('text')
        if not text:
            return jsonify({'error': 'No text or file provided'}), 400

    summary_length = request.form.get('length', 'medium')
    length_configs = {
        'short': {'max_length': 100, 'min_length': 50},
        'medium': {'max_length': 200, 'min_length': 100},
        'long': {'max_length': 300, 'min_length': 200}
    }
    config = length_configs.get(summary_length, length_configs['medium'])

    try:
        # Summarize using Hugging Face model
        summary = summarizer(text, max_length=config['max_length'], min_length=config['min_length'], do_sample=False)
        summary_text = summary[0]['summary_text']
        return jsonify({'summary': summary_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)