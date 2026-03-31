import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useAssessment } from "../context/Assessmentcontext";
import { computeRecommendations } from "../utils/recommendationEngine";
import "../styles/Assessment.css";

// ── Constants ────────────────────────────────────────────
const STORAGE_KEY = "coursify_assessment_progress";

const strandOptions = [
  { value: "STEM", desc: "Science, Technology, Engineering & Mathematics" },
  { value: "ABM", desc: "Accountancy, Business & Management" },
  { value: "HUMSS", desc: "Humanities & Social Sciences" },
  { value: "TVL", desc: "Technical-Vocational-Livelihood" },
  { value: "GAS", desc: "General Academic Strand" },
];

const riasecQuestions = [
  { id: "q1", text: "Building or fixing things with my hands." },
  { id: "q2", text: "Solving complex mathematical or scientific problems." },
  { id: "q3", text: "Drawing, designing, or creating art and music." },
  { id: "q4", text: "Helping, teaching, or counseling other people." },
  { id: "q5", text: "Leading groups and persuading or convincing others." },
  { id: "q6", text: "Organizing data, files, and following clear procedures." },
  { id: "q7", text: "Working with tools, machines, or outdoor activities." },
  { id: "q8", text: "Researching, analyzing, and investigating topics deeply." },
  { id: "q9", text: "Expressing myself through writing, performance, or design." },
  { id: "q10", text: "Volunteering, social work, or community service." },
  { id: "q11", text: "Negotiating, selling, or starting new ventures." },
  { id: "q12", text: "Working on structured tasks with clear rules and expectations." },
];

const mbtiQuestions = [
  {
    dimension: "EI",
    question: "Which feels more natural to you?",
    options: [
      { label: "I feel more energized after spending time with a group of people.", value: "E" },
      { label: "I feel more refreshed after spending time alone or in a quiet setting.", value: "I" },
    ],
  },
  {
    dimension: "EI",
    question: "When you have a problem to work through, you usually...",
    options: [
      { label: "Talk it out with someone — saying it aloud helps me think.", value: "E" },
      { label: "Reflect on it quietly by myself before sharing anything.", value: "I" },
    ],
  },
  {
    dimension: "SN",
    question: "When you learn something new, you prefer...",
    options: [
      { label: "Step-by-step instructions with concrete, real-world examples.", value: "S" },
      { label: "Understanding the big picture and the 'why' behind it first.", value: "N" },
    ],
  },
  {
    dimension: "SN",
    question: "Which statement fits you more?",
    options: [
      { label: "I trust what I can see, touch, or experience directly.", value: "S" },
      { label: "I often think about possibilities and what could be, not just what is.", value: "N" },
    ],
  },
  {
    dimension: "TF",
    question: "When making an important decision, you tend to...",
    options: [
      { label: "Focus on the facts and what makes the most logical sense.", value: "T" },
      { label: "Consider how the decision will affect the people involved.", value: "F" },
    ],
  },
  {
    dimension: "TF",
    question: "If a friend made a mistake, you would most likely...",
    options: [
      { label: "Point out what went wrong and how they can fix it practically.", value: "T" },
      { label: "Focus on how they are feeling and offer emotional support first.", value: "F" },
    ],
  },
  {
    dimension: "JP",
    question: "Which describes your ideal way of handling tasks?",
    options: [
      { label: "I like to plan ahead, set deadlines, and finish things early.", value: "J" },
      { label: "I prefer keeping things flexible and adapting as I go.", value: "P" },
    ],
  },
  {
    dimension: "JP",
    question: "How do you feel when plans suddenly change?",
    options: [
      { label: "It bothers me — I prefer knowing what to expect in advance.", value: "J" },
      { label: "I am fine with it — I actually enjoy a bit of spontaneity.", value: "P" },
    ],
  },
];

// ── Academic Questions (10 per subject, mix of MCQ + Likert) ──
const academicQuestions = {
  Math: [
    { id: "m1", type: "likert", text: "I understand how to solve linear equations." },
    { id: "m2", type: "mcq", text: "What is the value of x in: 2x + 6 = 14?", options: ["x = 3", "x = 4", "x = 5", "x = 10"], answer: "x = 4" },
    { id: "m3", type: "likert", text: "I can apply the Pythagorean theorem to solve problems." },
    { id: "m4", type: "mcq", text: "What is 15% of 200?", options: ["25", "30", "35", "40"], answer: "30" },
    { id: "m5", type: "likert", text: "I am comfortable working with fractions and decimals." },
    { id: "m6", type: "mcq", text: "Simplify: (x² + 5x + 6) ÷ (x + 2)", options: ["x + 3", "x + 2", "x − 3", "x − 2"], answer: "x + 3" },
    { id: "m7", type: "likert", text: "I can interpret graphs and data charts accurately." },
    { id: "m8", type: "mcq", text: "What is the area of a triangle with base 8 and height 5?", options: ["20", "40", "13", "80"], answer: "20" },
    { id: "m9", type: "likert", text: "I find it easy to follow mathematical proofs." },
    { id: "m10", type: "mcq", text: "If a square has a perimeter of 36, what is its area?", options: ["81", "72", "64", "36"], answer: "81" },
  ],
  Science: [
    { id: "s1", type: "likert", text: "I understand the basic laws of motion (Newton's Laws)." },
    { id: "s2", type: "mcq", text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], answer: "Mitochondria" },
    { id: "s3", type: "likert", text: "I can explain how photosynthesis works." },
    { id: "s4", type: "mcq", text: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Carbon Dioxide" },
    { id: "s5", type: "likert", text: "I understand the difference between physical and chemical changes." },
    { id: "s6", type: "mcq", text: "What is the atomic number of Carbon?", options: ["6", "12", "8", "14"], answer: "6" },
    { id: "s7", type: "likert", text: "I am confident reading and interpreting scientific data." },
    { id: "s8", type: "mcq", text: "What type of rock is formed from cooled lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"], answer: "Igneous" },
    { id: "s9", type: "likert", text: "I understand how ecosystems and food chains work." },
    { id: "s10", type: "mcq", text: "Which planet is closest to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: "Mercury" },
  ],
  English: [
    { id: "e1", type: "likert", text: "I can write a clear and organized paragraph." },
    { id: "e2", type: "mcq", text: "Which sentence is grammatically correct?", options: ["She don't know the answer.", "She doesn't knows the answer.", "She doesn't know the answer.", "She not know the answer."], answer: "She doesn't know the answer." },
    { id: "e3", type: "likert", text: "I understand literary devices like metaphors and similes." },
    { id: "e4", type: "mcq", text: "What is the synonym of 'benevolent'?", options: ["Cruel", "Kind", "Angry", "Strict"], answer: "Kind" },
    { id: "e5", type: "likert", text: "I can identify the main idea of a reading passage." },
    { id: "e6", type: "mcq", text: "Which is an example of a compound sentence?", options: ["The dog ran.", "I was tired, but I finished my work.", "Running fast.", "Because it rained."], answer: "I was tired, but I finished my work." },
    { id: "e7", type: "likert", text: "I am comfortable doing oral presentations in English." },
    { id: "e8", type: "mcq", text: "What does the word 'ambiguous' mean?", options: ["Very clear", "Open to multiple interpretations", "Very loud", "Absolutely certain"], answer: "Open to multiple interpretations" },
    { id: "e9", type: "likert", text: "I can write persuasive essays effectively." },
    { id: "e10", type: "mcq", text: "Which of these is a proper noun?", options: ["city", "teacher", "Manila", "building"], answer: "Manila" },
  ],
  Computer: [
    { id: "c1", type: "likert", text: "I am comfortable using spreadsheet software (Excel/Sheets)." },
    { id: "c2", type: "mcq", text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Power Unit", "Central Power Upgrade", "Core Processing Unit"], answer: "Central Processing Unit" },
    { id: "c3", type: "likert", text: "I understand basic programming concepts like loops and conditions." },
    { id: "c4", type: "mcq", text: "Which of these is NOT a programming language?", options: ["Python", "HTML", "Photoshop", "JavaScript"], answer: "Photoshop" },
    { id: "c5", type: "likert", text: "I can troubleshoot basic computer hardware problems." },
    { id: "c6", type: "mcq", text: "What does 'RAM' stand for?", options: ["Random Access Memory", "Read And Memorize", "Rapid Application Module", "Runtime Array Memory"], answer: "Random Access Memory" },
    { id: "c7", type: "likert", text: "I understand how the internet and networks work." },
    { id: "c8", type: "mcq", text: "Which file format is used for images?", options: [".mp3", ".exe", ".png", ".docx"], answer: ".png" },
    { id: "c9", type: "likert", text: "I can create and format basic documents and presentations." },
    { id: "c10", type: "mcq", text: "What is the function of an operating system?", options: ["Browse the internet", "Manage hardware and software resources", "Edit photos", "Store files only"], answer: "Manage hardware and software resources" },
  ],
  Filipino: [
    { id: "f1", type: "likert", text: "Nakakasulat ako ng malinaw na talata sa Filipino." },
    { id: "f2", type: "mcq", text: "Alin sa mga sumusunod ang tamang baybay?", options: ["Palengke", "Palingke", "Palenkge", "Palengque"], answer: "Palengke" },
    { id: "f3", type: "likert", text: "Naiintindihan ko ang mga akdang pampanitikan sa Filipino." },
    { id: "f4", type: "mcq", text: "Ano ang kahulugan ng salitang 'maunawain'?", options: ["Mapagmataas", "Magalang", "Mapagpasensya", "Mapagbigay"], answer: "Mapagpasensya" },
    { id: "f5", type: "likert", text: "Kaya kong tukuyin ang paksa ng isang pahayag." },
    { id: "f6", type: "mcq", text: "Aling pangungusap ang may tamang bantas?", options: ["Kumain ka na ba", "Kumain ka na ba?", "Kumain ka na ba!", "Kumain ka na ba,"], answer: "Kumain ka na ba?" },
    { id: "f7", type: "likert", text: "Komportable akong magsalita sa harap ng klase sa Filipino." },
    { id: "f8", type: "mcq", text: "Ano ang uri ng pangungusap na nagpapahayag ng utos?", options: ["Pasalaysay", "Patanong", "Padamdam", "Pautos"], answer: "Pautos" },
    { id: "f9", type: "likert", text: "Naiisulat ko ang aking mga nararamdaman sa pamamagitan ng tula." },
    { id: "f10", type: "mcq", text: "Sino ang itinuturing na 'Ama ng Wikang Pambansa'?", options: ["Jose Rizal", "Lope K. Santos", "Manuel Quezon", "Andres Bonifacio"], answer: "Lope K. Santos" },
  ],
  Humanities: [
    { id: "h1", type: "likert", text: "I understand the major events of Philippine history." },
    { id: "h2", type: "mcq", text: "What document ended Spanish rule in the Philippines?", options: ["Treaty of Paris", "Malolos Constitution", "Proclamation of Independence", "KKK Manifesto"], answer: "Treaty of Paris" },
    { id: "h3", type: "likert", text: "I can analyze how historical events affect present society." },
    { id: "h4", type: "mcq", text: "Who wrote the Noli Me Tangere?", options: ["Andres Bonifacio", "Emilio Aguinaldo", "Jose Rizal", "Marcelo del Pilar"], answer: "Jose Rizal" },
    { id: "h5", type: "likert", text: "I understand basic concepts in economics and government." },
    { id: "h6", type: "mcq", text: "What type of government does the Philippines follow?", options: ["Monarchy", "Federal Republic", "Unitary Presidential Republic", "Parliamentary"], answer: "Unitary Presidential Republic" },
    { id: "h7", type: "likert", text: "I can distinguish between different cultural and social perspectives." },
    { id: "h8", type: "mcq", text: "What does 'GDP' stand for?", options: ["General Daily Production", "Gross Domestic Product", "Government Development Plan", "Global Demand Price"], answer: "Gross Domestic Product" },
    { id: "h9", type: "likert", text: "I enjoy reading about social issues and current events." },
    { id: "h10", type: "mcq", text: "Which branch of government makes the laws in the Philippines?", options: ["Executive", "Judicial", "Legislative", "Military"], answer: "Legislative" },
  ],
};

const SUBJECTS = Object.keys(academicQuestions);

// Likert options
const LIKERT = [
  { label: "Strongly Disagree", value: 0 },
  { label: "Disagree", value: 0 },
  { label: "Neutral", value: 1 },
  { label: "Agree", value: 1 },
  { label: "Strongly Agree", value: 1 },
];

// ── Section statuses ─────────────────────────────────────
const SECTIONS = ["strand", "riasec", "mbti", "academic"];

const sectionLabels = {
  strand: { title: "SHS Strand", icon: "🎓", desc: "Your academic track" },
  riasec: { title: "RIASEC Interests", icon: "🧭", desc: "Holland Interest Inventory" },
  mbti: { title: "Personality (MBTI)", icon: "🧠", desc: "4 personality dimensions" },
  academic: { title: "Academic Assessment", icon: "📚", desc: "10 questions × 6 subjects" },
};

function sectionComplete(section, data) {
  if (section === "strand") return !!data.strand;
  if (section === "riasec") return Object.keys(data.riasecAnswers || {}).length === 12;
  if (section === "mbti") return Object.keys(data.mbtiAnswers || {}).length === 8;
  if (section === "academic") {
    return SUBJECTS.every(sub =>
      Object.keys((data.academicAnswers || {})[sub] || {}).length === 10
    );
  }
  return false;
}

// ── Main Component ───────────────────────────────────────
export default function Assessment() {
  const navigate = useNavigate();
  const { setAssessmentAnswers, setRecommendations } = useAssessment();

  // Load saved progress
  const loadSaved = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  };

  const [openSection, setOpenSection] = useState(null);
  const [strand, setStrand] = useState(loadSaved().strand || null);
  const [riasecAnswers, setRiasecAnswers] = useState(loadSaved().riasecAnswers || {});
  const [mbtiAnswers, setMbtiAnswers] = useState(loadSaved().mbtiAnswers || {});
  const [academicAnswers, setAcademicAnswers] = useState(loadSaved().academicAnswers || {});
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
  const [submitted, setSubmitted] = useState(false);

  const currentData = { strand, riasecAnswers, mbtiAnswers, academicAnswers };

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  }, [strand, riasecAnswers, mbtiAnswers, academicAnswers]);

  const allComplete = SECTIONS.every(s => sectionComplete(s, currentData));

  const completedCount = SECTIONS.filter(s => sectionComplete(s, currentData)).length;
  const progress = Math.round((completedCount / SECTIONS.length) * 100);

  // Academic answer helper
  const setAcademicAnswer = (subject, qid, value) => {
    setAcademicAnswers(prev => ({
      ...prev,
      [subject]: { ...(prev[subject] || {}), [qid]: value },
    }));
  };

  const handleSubmit = () => {
    const answers = { strand, riasecAnswers, mbtiAnswers, academicAnswers };
    const results = computeRecommendations(answers);
    setAssessmentAnswers(answers);
    setRecommendations(results);

    const historyEntry = {
      date: new Date().toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      strand: answers.strand,
      recommendations: results.slice(0, 5),
    };
    const existing = JSON.parse(localStorage.getItem("coursify_history") || "[]");
    localStorage.setItem("coursify_history",
      JSON.stringify([historyEntry, ...existing].slice(0, 10)));
    localStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  // ── Render ───────────────────────────────────────────
  if (submitted) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <main className="dashboard">
            <section className="assessment-complete">
              <div className="complete-icon">🎓</div>
              <h2>Assessment Complete!</h2>
              <p>Your personalized course recommendations are ready based on your strand, personality, and academic profile.</p>
              <button type="button" className="primary-btn-assess"
                onClick={() => navigate("/dashboard")}>
                View My Recommendations →
              </button>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <main className="assessment-page">

          {/* Page Header */}
          <div className="assessment-header">
            <div>
              <h2>Profile Assessment</h2>
              <p>Complete all four sections — you can save and continue anytime.</p>
            </div>
            {completedCount > 0 && (
              <span className="progress-badge">{completedCount}/{SECTIONS.length} completed</span>
            )}
          </div>

          {/* Overall Progress */}
          <div className="overall-progress">
            <div className="overall-progress-track">
              <div className="overall-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="overall-progress-label">{progress}% complete</span>
          </div>

          {/* Section Cards */}
          <div className="section-cards">
            {SECTIONS.map((section) => {
              const done = sectionComplete(section, currentData);
              const isOpen = openSection === section;
              const info = sectionLabels[section];

              return (
                <div key={section} className={`section-card ${done ? "done" : ""} ${isOpen ? "open" : ""}`}>

                  {/* Section Header */}
                  <button
                    type="button"
                    className="section-card-header"
                    onClick={() => setOpenSection(isOpen ? null : section)}
                  >
                    <div className="section-card-left">
                      <span className="section-icon">{info.icon}</span>
                      <div>
                        <span className="section-card-title">{info.title}</span>
                        <span className="section-card-desc">{info.desc}</span>
                      </div>
                    </div>
                    <div className="section-card-right">
                      {done
                        ? <span className="section-status done-badge">✓ Complete</span>
                        : <span className="section-status pending-badge">Pending</span>
                      }
                      <span className="section-chevron">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Section Body */}
                  {isOpen && (
                    <div className="section-body">

                      {/* ── STRAND ── */}
                      {section === "strand" && (
                        <div>
                          <p className="step-subtitle">Select your Senior High School strand.</p>
                          <div className="strand-grid">
                            {strandOptions.map((s) => (
                              <button key={s.value} type="button"
                                className={"strand-btn" + (strand === s.value ? " selected" : "")}
                                aria-pressed={strand === s.value}
                                onClick={() => setStrand(s.value)}>
                                <span className="strand-name">{s.value}</span>
                                <span className="strand-desc">{s.desc}</span>
                              </button>
                            ))}
                          </div>
                          {strand && (
                            <button type="button" className="section-done-btn"
                              onClick={() => setOpenSection(null)}>
                              Save & Close ✓
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── RIASEC ── */}
                      {section === "riasec" && (
                        <div>
                          <p className="step-subtitle">Rate how much each activity interests you — 1 (not at all) to 5 (very much).</p>
                          <div className="riasec-list">
                            {riasecQuestions.map((q, i) => {
                              const current = riasecAnswers[q.id] || 0;
                              return (
                                <div key={q.id} className="riasec-row">
                                  <span className="riasec-num">{i + 1}</span>
                                  <span className="riasec-text">{q.text}</span>
                                  <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                      <button key={val} type="button"
                                        className={"star-btn" + (current >= val ? " active" : "")}
                                        aria-label={`${val} star`}
                                        onClick={() => setRiasecAnswers({ ...riasecAnswers, [q.id]: val })}>
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {sectionComplete("riasec", currentData) && (
                            <button type="button" className="section-done-btn"
                              onClick={() => setOpenSection(null)}>
                              Save & Close ✓
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── MBTI ── */}
                      {section === "mbti" && (
                        <div>
                          <p className="step-subtitle">
                            Choose the option that feels most like you for each situation.
                          </p>
                          <div className="mbti-list">
                            {mbtiQuestions.map((q, i) => (
                              <div key={i} className="mbti-question">
                                <p className="mbti-q-text">{q.question}</p>
                                <div className="mbti-options">
                                  {q.options.map((opt) => (
                                    <button key={opt.value} type="button"
                                      className={"mbti-opt" + (mbtiAnswers[i] === opt.value ? " selected" : "")}
                                      aria-pressed={mbtiAnswers[i] === opt.value}
                                      onClick={() => setMbtiAnswers({ ...mbtiAnswers, [i]: opt.value })}>
                                      <span className="mbti-label">{opt.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {sectionComplete("mbti", currentData) && (
                            <button type="button" className="section-done-btn"
                              onClick={() => setOpenSection(null)}>
                              Save & Close ✓
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── ACADEMIC ── */}
                      {section === "academic" && (
                        <div>
                          <p className="step-subtitle">Answer 10 questions per subject. Progress saves automatically.</p>

                          {/* Subject Tabs */}
                          <div className="subject-tabs">
                            {SUBJECTS.map((sub) => {
                              const answered = Object.keys((academicAnswers[sub] || {})).length;
                              const subDone = answered === 10;
                              return (
                                <button key={sub} type="button"
                                  className={"subject-tab" + (activeSubject === sub ? " active" : "") + (subDone ? " done" : "")}
                                  onClick={() => setActiveSubject(sub)}>
                                  {subDone ? "✓ " : ""}{sub}
                                  <span className="subject-tab-count">{answered}/10</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Questions for active subject */}
                          <div className="academic-questions">
                            {academicQuestions[activeSubject].map((q, i) => {
                              const answered = (academicAnswers[activeSubject] || {})[q.id];
                              return (
                                <div key={q.id} className={`academic-q ${answered !== undefined ? "answered" : ""}`}>
                                  <p className="academic-q-text">
                                    <span className="academic-q-num">{i + 1}.</span> {q.text}
                                  </p>

                                  {q.type === "mcq" && (
                                    <div className="mcq-options">
                                      {q.options.map((opt) => {
                                        const isSelected = answered === opt;
                                        return (
                                          <button key={opt} type="button"
                                            className={"mcq-opt" + (isSelected ? " selected" : "")}
                                            aria-pressed={isSelected}
                                            onClick={() => setAcademicAnswer(activeSubject, q.id, opt)}>
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {q.type === "likert" && (
                                    <div className="likert-options">
                                      {LIKERT.map((opt, li) => {
                                        const isSelected = answered === opt.label;
                                        return (
                                          <button key={li} type="button"
                                            className={"likert-opt" + (isSelected ? " selected" : "")}
                                            aria-pressed={isSelected}
                                            onClick={() => setAcademicAnswer(activeSubject, q.id, opt.label)}>
                                            {opt.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {sectionComplete("academic", currentData) && (
                            <button type="button" className="section-done-btn"
                              onClick={() => setOpenSection(null)}>
                              Save & Close ✓
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="assessment-submit-area">
            {allComplete ? (
              <button type="button" className="submit-btn" onClick={handleSubmit}>
                🎯 Generate My Recommendations
              </button>
            ) : (
              <p className="submit-hint">
                Complete all 4 sections above to generate your recommendations.
              </p>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}