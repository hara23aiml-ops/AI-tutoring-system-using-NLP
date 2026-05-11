# Project Report

## Title

AI-Based Intelligent Tutoring System using NLP and LLM

## Student

Harsh Vardhan Raj

## Abstract

The AI-Based Intelligent Tutoring System using NLP and LLM is designed to support personalized learning through natural language interaction across multiple subjects. The system allows students to select a subject, ask questions, receive relevant explanations, attempt quizzes, and get feedback on written answers. The project uses Natural Language Processing techniques such as tokenization, stopword removal, keyword matching, and cosine similarity to identify the most relevant lesson and evaluate student responses. It also includes an optional Large Language Model mode for richer and more conversational tutor explanations.

## Introduction

Traditional learning systems often provide the same content to every student. An intelligent tutoring system improves this by adapting to student needs. NLP is useful because students can ask questions in normal language instead of using fixed menus. This makes the learning process more interactive and student friendly.

## Objectives

- To build a web-based tutoring system.
- To provide a login screen for different students.
- To process student questions using NLP.
- To recommend relevant learning content for different subjects.
- To use an optional LLM for personalized explanation generation.
- To evaluate written answers automatically.
- To provide feedback and track learning progress.

## Existing System

Many simple e-learning systems only provide static notes and quizzes. They usually do not understand student questions or provide personalized feedback.

## Proposed System

The proposed system accepts natural language questions from students, matches them with subject-specific lesson content, and returns explanations. If LLM mode is enabled, the system sends the matched lesson and student question to a language model to generate a more detailed tutor response. It also provides quizzes and evaluates student answers by comparing important concepts. Progress is saved using a student ID.

## Technology Stack

- Python for backend logic and HTTP routing.
- HTML, CSS, and JavaScript for the user interface.
- JSON for lesson and progress storage.
- NLP techniques for text preprocessing and similarity matching.
- Optional LLM integration through an OpenAI-compatible API.

## Architecture

```text
Student Interface
       |
       v
Python Web Server
       |
       +-- Subject Selection
       +-- NLP Lesson Matcher
       +-- Optional LLM Generator
       +-- Quiz Evaluator
       +-- Feedback Generator
       +-- Progress Tracker
       |
       v
JSON Data Files
```

## System Modules

1. Login Module: Allows different students to open separate learning sessions using a student ID.
2. Student Interface: Allows students to ask questions, view lessons, answer quizzes, and check progress.
3. Subject Module: Allows students to choose Artificial Intelligence, Mathematics, Science, English, Computer Science, or History.
4. Lesson Module: Stores lesson titles, summaries, keywords, explanations, examples, and quiz answers.
5. NLP Module: Performs tokenization, stopword removal, and similarity matching.
6. LLM Module: Generates richer explanations when an API key is configured.
7. Quiz Module: Displays practice questions for the selected lesson.
8. Evaluation Module: Scores answers using keyword overlap.
9. Feedback Module: Generates mastery level and improvement suggestions.
10. Progress Module: Saves student quiz attempts.

## Methodology

The system first preprocesses the student's question by converting it to lowercase, extracting words, and removing stopwords. It then compares the question tokens with the selected subject's lesson tokens. The lesson with the highest cosine similarity score is selected. If LLM mode is enabled, the matched lesson is used as context for the LLM response. During quiz evaluation, the system compares the student's answer with the expected answer and calculates a percentage score.

## Algorithm

1. Accept student question.
2. Accept selected subject.
3. Tokenize the question.
4. Remove stopwords.
5. Tokenize each relevant lesson document.
6. Calculate cosine similarity between question and lesson.
7. Select the lesson with the highest score.
8. If LLM mode is enabled, generate a tutor response using the matched lesson as context.
9. Display explanation and example.
10. Accept quiz answer.
11. Compare answer tokens with expected answer tokens.
12. Generate score, mastery level, and feedback.

## Advantages

- Easy to use.
- Runs offline.
- No external dependencies.
- Supports multiple subjects.
- Can use an LLM when internet and API key are available.
- Provides instant feedback.
- Can be expanded with advanced AI models.

## Limitations

- Uses keyword-based evaluation, so it may miss answers with different wording.
- Lesson dataset is small.
- No authentication module is included.

## Future Enhancements

- Add machine learning or transformer-based semantic similarity.
- Add more lessons and subjects.
- Add teacher dashboard.
- Add speech input.
- Add multilingual support.

## Conclusion

This project demonstrates how NLP and LLMs can be used to create an intelligent tutoring system. It provides multi-subject natural language question answering, quiz evaluation, feedback, and progress tracking. The system is simple, practical, and suitable as a foundation for a larger AI-based education platform.
