# ✨ AI Text Summarizer

A **modern, clean, AI-powered web application** that summarizes text or uploaded documents using **Hugging Face Transformers**.

### 🔗 Live Demo
Frontend (Vercel): https://frontend-summarizer.vercel.app/  
Backend (Render API): https://backend-portfolio-urvb.onrender.com/

---

## 🚀 Features
- Paste text or upload **TXT / PDF** files
- Choose summary length: **Short**, **Medium**, or **Long**
- **Dark / Light Mode** toggle
- Copy & Download summary
- Fully responsive UI (mobile & desktop friendly)

---

## 🧠 Tech Stack
| Layer | Technology |
|------|------------|
| Frontend | React + TailwindCSS + Vite |
| Backend | Flask (Python) |
| AI Model | **facebook/bart-large-cnn** (via Hugging Face API) |
| File Parsing | PyPDF2 |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure
ai-text-summarizer/
│
├── frontend/ # React UI
│ ├── src/App.jsx
│ ├── index.css
│ ├── vite.config.js
│ └── package.json
│
└── backend/ # Flask API
├── app.py
├── requirements.txt
└── .env (not committed)


---

## ⚙️ Setup Instructions

### ✅ Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

### ✅ Frontend Setup
cd frontend
npm install
npm run dev

👩🏾‍💻 Author

Patriciah Mbua
Crafting beautiful projects — one line of code at a time 💛