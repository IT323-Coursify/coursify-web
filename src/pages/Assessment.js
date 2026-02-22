import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAssessment } from "../context/Assessmentcontext";
import { computeRecommendations } from "../utils/recommendationEngine";
import "../styles/Assessment.css";

const strandOptions = ["STEM", "ABM", "HUMSS", "TVL", "GAS"];

const riasecQuestions = [
  { id: "q1",  text: "Building or fixing things with my hands." },
  { id: "q2",  text: "Solving complex mathematical or scientific problems." },
  { id: "q3",  text: "Drawing, designing, or creating art and music." },
  { id: "q4",  text: "Helping, teaching, or counseling other people." },
  { id: "q5",  text: "Leading groups and persuading or convincing others." },
  { id: "q6",  text: "Organizing data, files, and following clear procedures." },
  { id: "q7",  text: "Working with tools, machines, or outdoor activities." },
  { id: "q8",  text: "Researching, analyzing, and investigating topics deeply." },
  { id: "q9",  text: "Expressing myself through writing, performance, or design." },
  { id: "q10", text: "Volunteering, social work, or community service." },
  { id: "q11", text: "Negotiating, selling, or starting new ventures." },
  { id: "q12", text: "Working on structured tasks with clear rules and expectations." },
];

const mbtiQuestions = [
  {
    dimension: "EI",
    question: "In social situations, you usually...",
    options: [
      { label: "Enjoy being around many people and feel energized by social interaction.", value: "E" },
      { label: "Prefer smaller groups or alone time and need quiet to recharge.", value: "I" },
    ],
  },
  {
    dimension: "SN",
    question: "When learning something new, you tend to focus on...",
    options: [
      { label: "Practical details, step-by-step instructions, and real-world application.", value: "S" },
      { label: "The big picture, patterns, and future possibilities.", value: "N" },
    ],
  },
  {
    dimension: "TF",
    question: "When making decisions, you typically rely on...",
    options: [
      { label: "Logic, objective analysis, and what makes the most rational sense.", value: "T" },
      { label: "Your values, how it affects people, and what feels right.", value: "F" },
    ],
  },
  {
    dimension: "JP",
    question: "Your approach to tasks and deadlines is usually...",
    options: [
      { label: "Planned and organized — you like things decided and settled.", value: "J" },
      { label: "Flexible and spontaneous — you prefer to keep your options open.", value: "P" },
    ],
  },
];

const academicSubjects = ["Math", "Science", "Computer", "English", "Filipino", "History"];

const STEPS = ["strand", "riasec", "mbti", "academic", "done"];

const strandDesc = {
  STEM: "Science, Technology, Engineering & Mathematics",
  ABM: "Accountancy, Business & Management",
  HUMSS: "Humanities & Social Sciences",
  TVL: "Technical-Vocational-Livelihood",
  GAS: "General Academic Strand",
};

export default function Assessment() {
  const navigate = useNavigate();
  const { setAssessmentAnswers, setRecommendations } = useAssessment();

  const [stepIndex, setStepIndex] = useState(0);
  const [strand, setStrand] = useState(null);
  const [riasecAnswers, setRiasecAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [academicRatings, setAcademicRatings] = useState({});

  const currentStep = STEPS[stepIndex];
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const canProceed = () => {
    if (currentStep === "strand") return !!strand;
    if (currentStep === "riasec") return Object.keys(riasecAnswers).length === riasecQuestions.length;
    if (currentStep === "mbti") return Object.keys(mbtiAnswers).length === mbtiQuestions.length;
    if (currentStep === "academic") return academicSubjects.every((s) => academicRatings[s]);
    return false;
  };

  const handleNext = () => {
    if (currentStep === "academic") {
      const answers = { strand, riasecAnswers, mbtiAnswers, academicRatings };
      const results = computeRecommendations(answers);
      setAssessmentAnswers(answers);
      setRecommendations(results);
    }
    setStepIndex(stepIndex + 1);
  };

  const handleBack = () => setStepIndex(stepIndex - 1);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard">

        <div className="assessment-header">
          <h2>Profile Assessment</h2>
          <p>Answer honestly — your results drive your course recommendations.</p>
        </div>

        {currentStep !== "done" && (
          <div className="progress-wrapper">
            <div className="progress-label">Step {stepIndex + 1} of {STEPS.length - 1}</div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* STEP 1: SHS Strand */}
        {currentStep === "strand" && (
          <div className="step-card">
            <h3 className="step-title">What is your SHS strand?</h3>
            <p className="step-subtitle">Your academic track helps us understand your preparation.</p>
            <div className="strand-grid">
              {strandOptions.map((s) => (
                <button
                  key={s}
                  className={"strand-btn" + (strand === s ? " selected" : "")}
                  onClick={() => setStrand(s)}
                >
                  <span className="strand-name">{s}</span>
                  <span className="strand-desc">{strandDesc[s]}</span>
                </button>
              ))}
            </div>
            <div className="step-nav">
              <div />
              <button className="btn-next" onClick={handleNext} disabled={!canProceed()}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 2: RIASEC — 1 to 5 star rating */}
        {currentStep === "riasec" && (
          <div className="step-card">
            <h3 className="step-title">RIASEC Interest Inventory</h3>
            <p className="step-subtitle">
              Rate how much each activity interests you — 1 (not at all) to 5 (very much).
            </p>
            <div className="riasec-list">
              {riasecQuestions.map((q, i) => {
                const current = riasecAnswers[q.id] || 0;
                return (
                  <div key={q.id} className="riasec-row">
                    <span className="riasec-num">{i + 1}</span>
                    <span className="riasec-text">{q.text}</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          className={"star-btn" + (current >= val ? " active" : "")}
                          onClick={() => setRiasecAnswers({ ...riasecAnswers, [q.id]: val })}
                        >★</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <button className="btn-next" onClick={handleNext} disabled={!canProceed()}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 3: MBTI */}
        {currentStep === "mbti" && (
          <div className="step-card">
            <h3 className="step-title">Personality Indicator (MBTI)</h3>
            <p className="step-subtitle">Choose the option that best describes you for each pair.</p>
            <div className="mbti-list">
              {mbtiQuestions.map((q) => (
                <div key={q.dimension} className="mbti-question">
                  <p className="mbti-q-text">{q.question}</p>
                  <div className="mbti-options">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        className={"mbti-opt" + (mbtiAnswers[q.dimension] === opt.value ? " selected" : "")}
                        onClick={() => setMbtiAnswers({ ...mbtiAnswers, [q.dimension]: opt.value })}
                      >
                        <span className="mbti-badge">{opt.value}</span>
                        <span className="mbti-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <button className="btn-next" onClick={handleNext} disabled={!canProceed()}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 4: Academic Ratings */}
        {currentStep === "academic" && (
          <div className="step-card">
            <h3 className="step-title">Academic Self-Assessment</h3>
            <p className="step-subtitle">Rate your confidence in each subject (1 = low, 5 = high).</p>
            <div className="ratings-list">
              {academicSubjects.map((subject) => {
                const current = academicRatings[subject] || 0;
                return (
                  <div key={subject} className="rating-row">
                    <span className="rating-label">{subject}</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          className={"star-btn" + (current >= val ? " active" : "")}
                          onClick={() => setAcademicRatings({ ...academicRatings, [subject]: val })}
                        >★</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <button className="btn-next" onClick={handleNext} disabled={!canProceed()}>Submit ✓</button>
            </div>
          </div>
        )}

        {/* DONE */}
        {currentStep === "done" && (
          <div className="assessment-complete">
            <div className="complete-icon">🎓</div>
            <h2>Assessment Complete!</h2>
            <p>Your personalized course recommendations are ready based on your strand, personality, and academic profile.</p>
            <button className="primary-btn-assess" onClick={() => navigate("/dashboard")}>
              View My Recommendations →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}