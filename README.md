# AI-Based Intelligent Tutoring System using NLP and LLM

Student: Harsh Vardhan Raj

This project is a professional multi-subject intelligent tutoring system. It combines traditional NLP techniques with an optional LLM layer to support natural language question answering, lesson recommendation, answer evaluation, feedback generation, and learner progress tracking.

The application is designed to work in two modes:

- Offline NLP mode: uses tokenization, stopword removal, and cosine similarity.
- LLM-enhanced mode: uses an OpenAI-compatible chat completion API when an API key is configured.

## Features

- Student asks questions in natural language.
- Dedicated student login screen with separate progress for each student ID.
- Supports multiple subjects: Artificial Intelligence, Mathematics, Science, English, Computer Science, and History.
- NLP tokenizer removes common stopwords and compares text using cosine similarity.
- Tutor recommends the most relevant lesson.
- Optional LLM answer generation using an OpenAI-compatible chat completion endpoint.
- Quiz module evaluates written answers against expected concepts.
- Feedback module shows score, mastery level, matched keywords, and model answer.
- Progress module stores recent attempts in `data/progress.json`.
- Runs offline with Python standard library only.
- Professional dashboard interface with system metrics and LLM availability status.
- Polished responsive UI with learning module cards, subject overview badges, quick prompts, and refined feedback panels.

## System Architecture

```text
Student Browser
      |
      v
Python HTTP Server
      |
      +-- Subject and Lesson Module
      +-- NLP Matching Engine
      +-- Optional LLM Response Generator
      +-- Quiz and Evaluation Module
      +-- Progress Tracking Module
      |
      v
JSON Data Store
```

## How to Run Without LLM

1. Open this folder in a terminal.
2. Run:

```bash
python app.py
```

3. Open the browser at:

```text
http://127.0.0.1:8000
```

## How to Run With LLM

First stop any old server on port `8000`. Then run the helper script:

```powershell
.\start_with_llm.ps1
```

Paste your new OpenAI API key when asked.

Manual method:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
$env:OPENAI_MODEL="gpt-4o-mini"
python app.py
```

Then open:

```text
http://127.0.0.1:8000
```

Turn on `Use LLM answer` in the interface. If the API key is missing or the LLM request fails, the system automatically falls back to the built-in NLP answer.

## Step-by-Step Development

1. Problem selection: choose an AI tutoring system that supports personalized learning.
2. Requirement analysis: identify subject selection, lesson search, question answering, quiz evaluation, feedback, and progress tracking.
3. Data preparation: create a multi-subject lesson dataset with titles, summaries, keywords, explanations, examples, and quiz answers.
4. NLP preprocessing: tokenize text, convert to lowercase, and remove stopwords.
5. Similarity matching: compare the student question with lesson content using cosine similarity.
6. LLM integration: when enabled, send the matched lesson and student question to an LLM for a richer explanation.
7. Tutoring response: return the best lesson, explanation, example, confidence score, and LLM status.
8. Answer evaluation: compare student answer tokens with expected answer tokens.
9. Feedback generation: classify score as Strong, Developing, or Needs practice.
10. Progress tracking: save quiz attempts by student ID.
11. User interface: build a web page for subjects, lessons, questions, quiz answers, and progress.
12. Testing: ask sample questions, submit quiz answers, and verify progress updates.
13. Future enhancement: replace keyword overlap with transformer embeddings or add teacher analytics.

## Project Structure

```text
.
├── app.py
├── data
│   └── lessons.json
├── docs
│   └── project_report.md
├── static
│   ├── app.js
│   └── styles.css
└── templates
    └── index.html
```

## Sample Questions

- What is NLP?
- Explain tokenization.
- Solve 3x + 5 = 20.
- What is photosynthesis?
- When do we use simple present tense?
- What is an algorithm?
- Why was the Industrial Revolution important?
- How does answer evaluation work?
- What is adaptive learning?

## Technologies Used

- Backend: Python standard library HTTP server
- Frontend: HTML, CSS, JavaScript
- Data storage: JSON files
- NLP: tokenization, stopword removal, cosine similarity, keyword overlap
- Optional AI: OpenAI-compatible LLM chat completion API

## Future Scope

- Add login authentication.
- Add more subjects and lessons.
- Use semantic similarity with sentence embeddings.
- Add voice input and multilingual support.
- Add teacher dashboard and analytics.
