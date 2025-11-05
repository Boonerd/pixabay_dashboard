# AI Text Summarizer

A **beautiful, AI-powered** web app that summarizes text or documents (TXT, PDF, DOCX) using **Hugging Face Transformers**.

Live Demo: [https://ai-summarizer.boonerd.com](https://ai-summarizer.boonerd.com) *(coming soon)*

## Features
- Paste text or upload files
- Choose summary length: Short, Medium, Long
- Dark mode toggle
- Copy summary to clipboard
- Fully responsive

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Flask (Python)
- **AI**: Hugging Face (`distilbart-cnn-6-6`)
- **File Support**: PyPDF2, python-docx

## Setup
```bash
# Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm start

backend_portfolio/
├── frontend/          # React + Tailwind UI
│   ├── src/App.jsx    # Main UI with file/text input
│   ├── tailwind.config.cjs
│   └── package.json
└── backend/           # Flask + AI
├── app.py         # API endpoint /summarize
└── requirements.txt

Built with ❤️ by Patriciah Mbua