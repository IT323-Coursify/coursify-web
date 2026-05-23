import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAssessment } from "../context/Assessmentcontext";
import "../styles/Assessment.css";
import API_BASE_URL from "../config/api";

// ── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "coursify_assessment_progress";

const STRAND_OPTIONS = [
  { value: "STEM",  desc: "Science, Technology, Engineering & Mathematics" },
  { value: "ABM",   desc: "Accountancy, Business & Management" },
  { value: "HUMSS", desc: "Humanities & Social Sciences" },
  { value: "TVL",   desc: "Technical-Vocational-Livelihood" },
  { value: "GAS",   desc: "General Academic Strand" },
];

const LIKERT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const SECTIONS = [
  { key: "strand",   title: "SHS Strand",           icon: "🎓", desc: "Your academic track" },
  { key: "riasec",   title: "RIASEC Interests",      icon: "🧭", desc: "Holland Interest Inventory · 36 questions" },
  { key: "bigfive",  title: "Big Five Personality",  icon: "🧠", desc: "OCEAN Personality Model · 25 questions" },
  { key: "math",     title: "Math Aptitude",          icon: "📐", desc: "Algebra, Geometry, Statistics, Logic · 12 questions" },
  { key: "science",  title: "Science Aptitude",       icon: "🔬", desc: "Biology, Physics, Chemistry, Earth Science · 12 questions" },
  { key: "english",  title: "English Aptitude",       icon: "📖", desc: "Grammar, Reading, Vocabulary, Verbal Reasoning · 12 questions" },
  { key: "abstract", title: "Abstract Reasoning",     icon: "🔷", desc: "Patterns, Sequences, Spatial & Analogical Reasoning · 12 questions" },
];


// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Decode the user ID from the JWT stored in localStorage.
 * Returns null if the token is missing or malformed.
 */
function getCurrentUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Support both "sub" and "id" claims depending on your backend
    return payload.sub ?? payload.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Load saved draft from localStorage only if it belongs to the current user.
 * If the userId doesn't match, the stale entry is removed immediately.
 */
function loadSaved(currentUserId) {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return {};
    const parsed = JSON.parse(s);
    if (parsed.userId && parsed.userId !== currentUserId) {
      // Different user — discard and start fresh
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function isSectionComplete(key, questions, answers) {
  if (key === "strand") return !!answers.strand;

  if (key === "riasec") {
    return (
      questions?.riasec &&
      Object.keys(answers.riasecAnswers || {}).length === questions.riasec.length
    );
  }

  if (key === "bigfive") {
    return (
      questions?.bigfive &&
      Object.keys(answers.bigfiveAnswers || {}).length === questions.bigfive.length
    );
  }

  if (["math", "science", "english", "abstract"].includes(key)) {
    const qs = questions?.aptitude?.[key];
    return (
      qs &&
      Object.keys((answers.aptitudeAnswers || {})[key] || {}).length === qs.length
    );
  }

  return false;
}

function SectionProgress({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="section-progress">
      <div className="section-progress-track">
        <div className="section-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="section-progress-label">{current}/{total}</span>
    </div>
  );
}


// ── Main Component ────────────────────────────────────────────────────────────
export default function Assessment() {
  const navigate = useNavigate();
  const {
    questions, setQuestions,
    questionsLoading, setQuestionsLoading,
    questionsError,   setQuestionsError,
    setAssessmentAnswers, setResultId,
  } = useAssessment();

  // Resolve current user ID once on render (stable for the session)
  const currentUserId = getCurrentUserId();

  // Load draft only if it was saved by the same user
  const saved = loadSaved(currentUserId);

  // ── Answer state ──
  const [strand,          setStrand]          = useState(saved.strand          || null);
  const [riasecAnswers,   setRiasecAnswers]   = useState(saved.riasecAnswers   || {});
  const [bigfiveAnswers,  setBigfiveAnswers]  = useState(saved.bigfiveAnswers  || {});
  const [aptitudeAnswers, setAptitudeAnswers] = useState(saved.aptitudeAnswers || {});

  // ── UI state ──
  const [openSection, setOpenSection] = useState(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ── Auto-save progress (scoped to current user) ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      userId: currentUserId,          // ← ties the draft to this account
      strand,
      riasecAnswers,
      bigfiveAnswers,
      aptitudeAnswers,
    }));
  }, [currentUserId, strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers]);

  // ── Fetch questions ──────────────────────────────────────────────────────
const fetchQuestions = useCallback(async () => {
  const token = localStorage.getItem("token");
  if (!token) { navigate("/"); return; }
  try {
    setQuestionsLoading(true);
    setQuestionsError(null);
    const res  = await fetch(`${API_BASE_URL}/api/assessment/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to load questions.");
    setQuestions(data);

    // ── FIX: scrub any stale answer keys not in the new question set ──
    const freshRiasecIds  = new Set(data.riasec.map(q => q._id));
    const freshBigfiveIds = new Set(data.bigfive.map(q => q._id));
    const freshAptitudeIds = {
      math:     new Set(data.aptitude.math.map(q => q._id)),
      science:  new Set(data.aptitude.science.map(q => q._id)),
      english:  new Set(data.aptitude.english.map(q => q._id)),
      abstract: new Set(data.aptitude.abstract.map(q => q._id)),
    };

    setRiasecAnswers(prev =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => freshRiasecIds.has(id)))
    );
    setBigfiveAnswers(prev =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => freshBigfiveIds.has(id)))
    );
    setAptitudeAnswers(prev => {
      const cleaned = {};
      for (const subj of ["math", "science", "english", "abstract"]) {
        cleaned[subj] = Object.fromEntries(
          Object.entries(prev[subj] || {}).filter(([id]) => freshAptitudeIds[subj].has(id))
        );
      }
      return cleaned;
    });

  } catch (err) {
    setQuestionsError(err.message);
  } finally {
    setQuestionsLoading(false);
  }
}, [navigate, setQuestions, setQuestionsLoading, setQuestionsError]);

  /**
   * FIX: Always fetch fresh questions on mount.
   *
   * The previous code skipped the fetch if `questions` was already set in
   * context (`if (!questions) fetchQuestions()`). That meant switching accounts
   * in the same browser session reused the old question set (with different _ids
   * than the new user's saved answers), so isSectionComplete() never returned
   * true and "Save & Close" / the submit button never appeared.
   *
   * Clearing context (`setQuestions(null)`) on logout (see Sidebar.jsx) also
   * helps, but always fetching here is the safe belt-and-suspenders fix.
   */
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount only

  // ── Progress ──
  const answersObj = { strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers };

  const completedSections = SECTIONS.filter(s =>
    isSectionComplete(s.key, questions, answersObj)
  ).length;
  const overallPct  = Math.round((completedSections / SECTIONS.length) * 100);
  const allComplete = completedSections === SECTIONS.length;

  // ── Answer helpers ──
  const setAptitudeAnswer = (subject, qid, value) => {
    setAptitudeAnswers(prev => ({
      ...prev,
      [subject]: { ...(prev[subject] || {}), [qid]: value },
    }));
  };

  // ── Submit ──
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Flatten { math: { qid: "A" }, science: { qid: "B" } }
      // into   { qid: "A", qid2: "B" } — what the backend expects
      const flatAptitudeAnswers = Object.values(aptitudeAnswers).reduce(
        (acc, subjectAnswers) => ({ ...acc, ...subjectAnswers }),
        {}
      );

      const res = await fetch(`${API_BASE_URL}/api/assessment/submit`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          strand,
          riasec_answers:   riasecAnswers,
          bigfive_answers:  bigfiveAnswers,
          aptitude_answers: flatAptitudeAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed.");

      setAssessmentAnswers({ strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers });
      setResultId(data.result_id);
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submitted screen ──
  if (submitted) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <main className="dashboard">
            <section className="assessment-complete">
              <div className="complete-icon">🎓</div>
              <h2>Assessment Complete!</h2>
              <p>Your answers have been saved. Course recommendations will be generated soon.</p>
              <button type="button" className="primary-btn-assess"
                onClick={() => navigate("/dashboard")}>
                Back to Dashboard →
              </button>
            </section>
          </main>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (questionsLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <main className="assessment-page">
            <div className="questions-loading">
              <div className="loading-spinner" />
              <p>Loading your assessment questions...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (questionsError) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <main className="assessment-page">
            <div className="questions-error">
              <p>⚠️ {questionsError}</p>
              <button type="button" className="primary-btn-assess" onClick={fetchQuestions}>
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <main className="assessment-page">

          {/* Header */}
          <div className="assessment-header">
            <div>
              <h2>Course Assessment</h2>
              <p>Complete all sections — your progress saves automatically.</p>
            </div>
            <span className="progress-badge">{completedSections}/{SECTIONS.length} completed</span>
          </div>

          {/* Overall progress bar */}
          <div className="overall-progress">
            <div className="overall-progress-track">
              <div className="overall-progress-fill" style={{ width: `${overallPct}%` }} />
            </div>
            <span className="overall-progress-label">{overallPct}% complete</span>
          </div>

          {/* Section cards */}
          <div className="section-cards">
            {SECTIONS.map((section) => {
              const done   = isSectionComplete(section.key, questions, answersObj);
              const isOpen = openSection === section.key;

              return (
                <div key={section.key}
                  className={`section-card ${done ? "done" : ""} ${isOpen ? "open" : ""}`}>

                  <button type="button" className="section-card-header"
                    onClick={() => setOpenSection(isOpen ? null : section.key)}>
                    <div className="section-card-left">
                      <span className="section-icon">{section.icon}</span>
                      <div>
                        <span className="section-card-title">{section.title}</span>
                        <span className="section-card-desc">{section.desc}</span>
                      </div>
                    </div>
                    <div className="section-card-right">
                      {done
                        ? <span className="section-status done-badge">✓ Complete</span>
                        : <span className="section-status pending-badge">Pending</span>}
                      <span className="section-chevron">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="section-body">

                      {section.key === "strand" && (
                        <StrandSection
                          strand={strand}
                          setStrand={setStrand}
                          onDone={() => setOpenSection(null)}
                        />
                      )}

                      {section.key === "riasec" && questions?.riasec && (
                        <LikertSection
                          questions={questions.riasec}
                          answers={riasecAnswers}
                          setAnswers={setRiasecAnswers}
                          subtitle="Rate how much each activity interests you."
                          onDone={() => setOpenSection(null)}
                          done={done}
                        />
                      )}

                      {section.key === "bigfive" && questions?.bigfive && (
                        <LikertSection
                          questions={questions.bigfive}
                          answers={bigfiveAnswers}
                          setAnswers={setBigfiveAnswers}
                          subtitle="Rate how accurately each statement describes you."
                          onDone={() => setOpenSection(null)}
                          done={done}
                        />
                      )}

                      {["math","science","english","abstract"].includes(section.key) &&
                        questions?.aptitude?.[section.key] && (
                        <AptitudeSection
                          subject={section.key}
                          questions={questions.aptitude[section.key]}
                          answers={(aptitudeAnswers[section.key] || {})}
                          setAnswer={(qid, val) => setAptitudeAnswer(section.key, qid, val)}
                          onDone={() => setOpenSection(null)}
                          done={done}
                        />
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit area */}
          <div className="assessment-submit-area">
            {submitError && <p className="submit-error">⚠️ {submitError}</p>}
            {allComplete ? (
              <button type="button" className="submit-btn"
                onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "🎯 Submit Assessment"}
              </button>
            ) : (
              <p className="submit-hint">
                Complete all {SECTIONS.length} sections above to submit your assessment.
              </p>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}


// ── Sub-components ────────────────────────────────────────────────────────────

function StrandSection({ strand, setStrand, onDone }) {
  return (
    <div>
      <p className="step-subtitle">Select your Senior High School strand.</p>
      <div className="strand-grid">
        {STRAND_OPTIONS.map((s) => (
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
        <button type="button" className="section-done-btn" onClick={onDone}>
          Save & Close ✓
        </button>
      )}
    </div>
  );
}


function LikertSection({ questions, answers, setAnswers, subtitle, onDone, done }) {
  const answered = Object.keys(answers).length;
  const total    = questions.length;

  return (
    <div>
      <p className="step-subtitle">{subtitle}</p>

      <div className="likert-legend">
        {LIKERT_LABELS.map((label, i) => (
          <div key={i} className="likert-legend-item">
            <span className="likert-legend-num">{i + 1}</span>
            <span className="likert-legend-label">{label}</span>
          </div>
        ))}
      </div>

      <SectionProgress current={answered} total={total} />

      <div className="riasec-list">
        {questions.map((q, i) => {
          const current = answers[q._id] || 0;
          return (
            <div key={q._id} className={`riasec-row ${current ? "answered" : ""}`}>
              <span className="riasec-num">{i + 1}</span>
              <span className="riasec-text">{q.text}</span>
              <div className="likert-scale">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button key={val} type="button"
                    className={"likert-btn" + (current === val ? " active" : "")}
                    title={LIKERT_LABELS[val - 1]}
                    onClick={() => setAnswers(prev => ({ ...prev, [q._id]: val }))}>
                    {val}
                  </button>
                ))}
                {current > 0 && (
                  <span className="likert-selected-label">{LIKERT_LABELS[current - 1]}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {done && (
        <button type="button" className="section-done-btn" onClick={onDone}>
          Save & Close ✓
        </button>
      )}
    </div>
  );
}


function AptitudeSection({ subject, questions, answers, setAnswer, onDone, done }) {
  const answered = Object.keys(answers).length;
  const total    = questions.length;

  return (
    <div>
      <p className="step-subtitle">Choose the best answer for each question.</p>
      <SectionProgress current={answered} total={total} />

      {questions.map((q, i) => {
        const selected = answers[q._id];
        return (
          <div key={q._id} className={`academic-q ${selected ? "answered" : ""}`}>
            <p className="academic-q-text">
              <span className="academic-q-num">{i + 1}.</span>
              {q.text}
            </p>
            <div className="mcq-options">
              {(q.options || []).map((opt) => {
                const isSelected = selected === opt.label;
                return (
                  <button key={opt.label} type="button"
                    className={"mcq-opt" + (isSelected ? " selected" : "")}
                    aria-pressed={isSelected}
                    onClick={() => setAnswer(q._id, opt.label)}>
                    <span className="mcq-label">{opt.label}.</span>
                    <span className="mcq-value">{opt.value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {done && (
        <button type="button" className="section-done-btn" onClick={onDone}>
          Save & Close ✓
        </button>
      )}
    </div>
  );
}