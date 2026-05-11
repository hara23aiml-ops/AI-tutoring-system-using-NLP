let selectedLessonId = null;
let activeQuizLessonId = null;

const loginScreen = document.querySelector("#loginScreen");
const appShell = document.querySelector("#appShell");
const loginStudentId = document.querySelector("#loginStudentId");
const enterAppButton = document.querySelector("#enterAppButton");
const lessonList = document.querySelector("#lessonList");
const questionInput = document.querySelector("#questionInput");
const answerCard = document.querySelector("#answerCard");
const quizQuestion = document.querySelector("#quizQuestion");
const answerInput = document.querySelector("#answerInput");
const feedbackCard = document.querySelector("#feedbackCard");
const studentId = document.querySelector("#studentId");
const activeStudent = document.querySelector("#activeStudent");
const loginButton = document.querySelector("#loginButton");
const subjectSelect = document.querySelector("#subjectSelect");
const useLlm = document.querySelector("#useLlm");
const progressSummary = document.querySelector("#progressSummary");
const progressList = document.querySelector("#progressList");
const subjectCount = document.querySelector("#subjectCount");
const lessonCount = document.querySelector("#lessonCount");
const llmStatus = document.querySelector("#llmStatus");
const subjectOverview = document.querySelector("#subjectOverview");
let allLessons = [];
let systemStatus = null;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function html(strings, ...values) {
  return strings.reduce((output, string, index) => {
    const value = values[index] ?? "";
    return output + string + value;
  }, "");
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadLessons() {
  const data = await api("/api/lessons");
  allLessons = data.lessons;
  lessonCount.textContent = allLessons.length;
  renderLessons();
}

async function loadSubjects() {
  const data = await api("/api/subjects");
  const subjects = data.subjects.map((subject) =>
    typeof subject === "string" ? { name: subject, lesson_count: 0, levels: [] } : subject
  );
  subjectCount.textContent = subjects.length;
  subjectOverview.innerHTML = subjects
    .map(
      (subject) =>
        `<button class="subject-pill" type="button" data-subject="${escapeText(subject.name)}">${escapeText(subject.name)}${subject.lesson_count ? `: ${subject.lesson_count}` : ""}</button>`
    )
    .join("");
  subjectSelect.innerHTML = [
    '<option value="">All Subjects</option>',
    ...subjects.map((subject) => {
      const label = subject.lesson_count ? `${subject.name} (${subject.lesson_count})` : subject.name;
      return `<option value="${escapeText(subject.name)}">${escapeText(label)}</option>`;
    }),
  ].join("");
}

async function loadStatus() {
  systemStatus = await api("/api/status");
  subjectCount.textContent = systemStatus.subject_count;
  lessonCount.textContent = systemStatus.lesson_count;
  llmStatus.textContent = systemStatus.llm_available ? systemStatus.model : "Not configured";
  llmStatus.className = systemStatus.llm_available ? "" : "warning";
  useLlm.disabled = !systemStatus.llm_available;
  useLlm.checked = false;
}

function renderLessons() {
  const subject = subjectSelect.value;
  const visibleLessons = allLessons.filter((lesson) => !subject || lesson.subject === subject);
  if (!visibleLessons.some((lesson) => lesson.id === selectedLessonId)) {
    selectedLessonId = visibleLessons[0]?.id ?? null;
  }
  lessonList.innerHTML = visibleLessons
    .map((lesson) =>
      html`<article class="lesson-item ${lesson.id === selectedLessonId ? "active" : ""}" data-id="${lesson.id}">
        <div class="lesson-title">
          <span>${escapeText(lesson.title)}</span>
          <span class="level">${escapeText(lesson.level)}</span>
        </div>
        <p class="lesson-subject">${escapeText(lesson.subject)}</p>
        <p class="lesson-summary">${escapeText(lesson.summary)}</p>
      </article>`
    )
    .join("") || '<article class="response-card empty">No lessons are available for this subject.</article>';
  updateSelectedLessonContext();
}

lessonList.addEventListener("click", (event) => {
  const item = event.target.closest(".lesson-item");
  if (!item) return;
  selectedLessonId = item.dataset.id;
  const lesson = allLessons.find((module) => module.id === selectedLessonId);
  if (lesson) {
    subjectSelect.value = lesson.subject;
    renderLessons();
  }
  updateSelectedLessonContext();
});

document.querySelector("#askButton").addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) {
    answerCard.className = "response-card empty";
    answerCard.textContent = "Type a question first.";
    return;
  }

  const result = await api("/api/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      subject: subjectSelect.value,
      use_llm: useLlm.checked,
    }),
  });

  if (result.type === "fallback") {
    answerCard.className = "response-card";
    answerCard.innerHTML = html`<strong>LLM setup needed</strong><p>${escapeText(result.answer)}</p>`;
    return;
  }

  selectedLessonId = result.lesson_id;
  document.querySelectorAll(".lesson-item").forEach((lesson) => {
    lesson.classList.toggle("active", lesson.dataset.id === selectedLessonId);
  });
  answerCard.className = "response-card";
  answerCard.innerHTML = html`
    <strong>${escapeText(result.title)}</strong>
    <p><strong>Subject:</strong> ${escapeText(result.subject)}</p>
    <p>${escapeText(result.answer)}</p>
    <p><strong>Example:</strong> ${escapeText(result.example)}</p>
    <p>Matched in: ${escapeText(result.matched_scope || result.subject)} | Confidence: ${escapeText(result.confidence)} | LLM: ${result.llm_used ? "Used" : "Fallback"}</p>
  `;
});

document.querySelector("#startQuiz").addEventListener("click", async () => {
  if (!selectedLessonId) {
    feedbackCard.className = "response-card empty";
    feedbackCard.textContent = "Choose a learning module first.";
    return;
  }
  const result = await api("/api/quiz", {
    method: "POST",
    body: JSON.stringify({ lesson_id: selectedLessonId, subject: subjectSelect.value }),
  });
  activeQuizLessonId = result.lesson_id;
  quizQuestion.textContent = result.question;
  answerInput.value = "";
  feedbackCard.className = "response-card empty";
  feedbackCard.textContent = "Write your answer, then submit it.";
});

document.querySelector("#submitAnswer").addEventListener("click", async () => {
  if (!activeQuizLessonId) {
    feedbackCard.className = "response-card empty";
    feedbackCard.textContent = "Start a quiz first.";
    return;
  }

  const answer = answerInput.value.trim();
  if (!answer) {
    feedbackCard.className = "response-card empty";
    feedbackCard.textContent = "Write an answer before submitting.";
    return;
  }

  const result = await api("/api/evaluate", {
    method: "POST",
    body: JSON.stringify({
      lesson_id: activeQuizLessonId,
      answer,
      student_id: studentId.value.trim() || "guest",
    }),
  });

  feedbackCard.className = "response-card";
  feedbackCard.innerHTML = html`
    <p><span class="score">Score: ${result.score}%</span> | Mastery: ${escapeText(result.mastery)}</p>
    <p>${escapeText(result.feedback)}</p>
    <p><strong>Model answer:</strong> ${escapeText(result.model_answer)}</p>
    <div class="keyword-row">
      ${result.matched_keywords.map((word) => `<span class="chip">${escapeText(word)}</span>`).join("")}
    </div>
  `;
  await loadProgress();
});

async function loadProgress() {
  const id = encodeURIComponent(studentId.value.trim() || "guest");
  const progress = await api(`/api/progress/${id}`);
  progressSummary.textContent = `${progress.completed} attempt(s), average score ${progress.average_score}%.`;
  progressList.innerHTML = progress.attempts
    .map((attempt) => `<li>${escapeText(attempt.lesson_id)}: ${attempt.score}% (${escapeText(attempt.mastery)})</li>`)
    .join("");
}

document.querySelector("#refreshProgress").addEventListener("click", loadProgress);
studentId.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginStudent();
  }
});
loginButton.addEventListener("click", loginStudent);
subjectSelect.addEventListener("change", renderLessons);
subjectOverview.addEventListener("click", (event) => {
  const button = event.target.closest(".subject-pill");
  if (!button) return;
  subjectSelect.value = button.dataset.subject;
  renderLessons();
});
useLlm.addEventListener("change", () => {
  if (useLlm.checked && systemStatus && !systemStatus.llm_available) {
    useLlm.checked = false;
    answerCard.className = "response-card empty";
    answerCard.textContent = "LLM mode needs OPENAI_API_KEY. The offline NLP tutor is still available.";
  }
});

document.querySelectorAll(".quick-prompts button").forEach((button) => {
  button.addEventListener("click", () => {
    questionInput.value = button.dataset.question;
    questionInput.focus();
  });
});

async function loginStudent() {
  const id = studentId.value.trim() || "guest";
  studentId.value = id;
  activeStudent.textContent = id;
  progressSummary.textContent = `Logged in as ${id}. Loading progress...`;
  await loadProgress();
}

function updateSelectedLessonContext() {
  document.querySelectorAll(".lesson-item").forEach((lesson) => {
    lesson.classList.toggle("active", lesson.dataset.id === selectedLessonId);
  });

  const lesson = allLessons.find((module) => module.id === selectedLessonId);
  if (!lesson) return;

  activeQuizLessonId = null;
  quizQuestion.textContent = `${lesson.title}: click Start Quiz to practice this module.`;
  answerCard.className = "response-card empty";
  answerCard.textContent = `Selected module: ${lesson.title}. Ask a question or start a quiz.`;
  feedbackCard.className = "response-card empty";
  feedbackCard.textContent = "Feedback will appear here.";
}

async function openDashboard() {
  const id = loginStudentId.value.trim() || "guest";
  studentId.value = id;
  activeStudent.textContent = id;
  loginScreen.classList.add("is-hidden");
  appShell.classList.remove("is-hidden");
  await loadProgress();
}

loginStudentId.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    openDashboard();
  }
});
enterAppButton.addEventListener("click", openDashboard);

loadStatus().then(loadSubjects).then(loadLessons);
