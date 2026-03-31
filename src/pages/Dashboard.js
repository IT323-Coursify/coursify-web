import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Sidebar from "../components/SideBar";
import { useRecommendations } from "../hooks/useRecommendation";
import "../styles/Dashboard.css";

// ── Calendar Helper ──────────────────────────────────────
function Calendar() {
  const [current, setCurrent] = useState(new Date());

  const year = current.getFullYear();
  const month = current.getMonth();
  const today = new Date();

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <span className="cal-month">{monthNames[month]} {year}</span>
        <div className="cal-nav">
          <button type="button" onClick={prev} className="cal-nav-btn">‹</button>
          <button type="button" onClick={next} className="cal-nav-btn">›</button>
        </div>
      </div>
      <div className="cal-grid">
        {dayNames.map(d => (
          <span key={d} className="cal-day-label">{d}</span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`cal-cell ${d === null ? "cal-empty" : ""} ${isToday(d) ? "cal-today" : ""}`}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── RIASEC / MBTI Result Cards ───────────────────────────
const riasecInfo = {
  R: { label: "Realistic",     color: "#e0f2fe", accent: "#0284c7", emoji: "🔧", desc: "You prefer hands-on work, practical tasks, and working with tools, machines, or nature. You tend to be independent, stable, and persistent." },
  I: { label: "Investigative", color: "#f0fdf4", accent: "#16a34a", emoji: "🔬", desc: "You enjoy exploring ideas, solving problems analytically, and working independently. You are curious, precise, and intellectually driven." },
  A: { label: "Artistic",      color: "#fdf4ff", accent: "#9333ea", emoji: "🎨", desc: "You are creative and expressive, preferring unstructured work that allows imagination. You thrive in art, design, writing, and performance." },
  S: { label: "Social",        color: "#fff7ed", accent: "#ea580c", emoji: "🤝", desc: "You enjoy helping, teaching, and working closely with other people. You are empathetic, cooperative, and service-oriented." },
  E: { label: "Enterprising",  color: "#fefce8", accent: "#ca8a04", emoji: "🚀", desc: "You are persuasive, energetic, and enjoy leading or managing others. You are drawn to business, sales, and leadership roles." },
  C: { label: "Conventional",  color: "#f0fdf4", accent: "#15803d", emoji: "📋", desc: "You prefer structured, orderly work with clear rules. You excel in data management, accounting, and administrative roles." },
};

const mbtiInfo = {
  INTJ: "Strategic mastermind. Independent, driven, and long-term focused. You build complex systems and pursue goals with relentless precision.",
  INTP: "Logical innovator. You love theories and abstract thinking, solving complex problems with original and unconventional approaches.",
  ENTJ: "Commanding leader. You are decisive, efficient, and driven to organize people and resources toward long-term goals.",
  ENTP: "Inventive debater. You challenge norms, think laterally, and thrive when generating and stress-testing new ideas.",
  INFJ: "Insightful idealist. Rare and empathetic, you see patterns in people and are deeply committed to meaningful causes.",
  INFP: "Compassionate dreamer. You are guided by strong inner values, creativity, and a desire to make the world more humane.",
  ENFJ: "Inspiring mentor. Warm and charismatic, you motivate others and excel at bringing out the best in people.",
  ENFP: "Enthusiastic connector. Creative, people-oriented, and full of energy — you see possibility everywhere.",
  ISTJ: "Reliable executor. Methodical and detail-oriented, you can be counted on to follow through with precision and integrity.",
  ISFJ: "Devoted protector. Warm, conscientious, and responsible — you quietly support others with great care and dedication.",
  ESTJ: "Efficient organizer. Practical and assertive, you enforce structure, value results, and take charge when needed.",
  ESFJ: "Caring host. Warm and sociable, you prioritize harmony and work hard to support the people around you.",
  ISTP: "Tactical problem-solver. Cool, observant, and hands-on — you diagnose issues quickly and act with calm precision.",
  ISFP: "Gentle creator. You express yourself through aesthetics and action, quietly following your own sense of beauty.",
  ESTP: "Bold opportunist. Energetic and practical, you thrive in fast-paced situations and excel at improvisation.",
  ESFP: "Vivid entertainer. Spontaneous and fun-loving, you bring energy to every room and connect naturally with others.",
};

function PersonalityPanel({ assessmentAnswers }) {
  const [expanded, setExpanded] = useState(null);

  if (!assessmentAnswers) {
    return (
      <div className="personality-panel">
        <h4 className="panel-title">Your Personality Profile</h4>
        <p className="panel-empty">Complete the assessment to see your RIASEC and MBTI results.</p>
      </div>
    );
  }

  const { riasecAnswers, mbtiAnswers } = assessmentAnswers;

  // Compute top 3 RIASEC types
  const riasecQuestionTypes = {
    q1:"R", q2:"I", q3:"A", q4:"S", q5:"E", q6:"C",
    q7:"R", q8:"I", q9:"A", q10:"S", q11:"E", q12:"C",
  };
  const riasecScores = { R:0, I:0, A:0, S:0, E:0, C:0 };
  Object.entries(riasecAnswers || {}).forEach(([qid, rating]) => {
    const type = riasecQuestionTypes[qid];
    if (type) riasecScores[type] += rating;
  });
  const topRIASEC = Object.entries(riasecScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);

  const mbtiType = mbtiAnswers
    ? `${mbtiAnswers.EI||"I"}${mbtiAnswers.SN||"N"}${mbtiAnswers.TF||"T"}${mbtiAnswers.JP||"J"}`
    : null;

  return (
    <div className="personality-panel">
      <h4 className="panel-title">Your Personality Profile</h4>

      {/* MBTI */}
      {mbtiType && (
        <div className="personality-section">
          <p className="personality-section-label">MBTI Type</p>
          <button
            type="button"
            className={`mbti-badge-btn ${expanded === "mbti" ? "expanded" : ""}`}
            onClick={() => setExpanded(expanded === "mbti" ? null : "mbti")}
          >
            <span className="mbti-type-label">{mbtiType}</span>
            <span className="mbti-chevron">{expanded === "mbti" ? "▲" : "▼"}</span>
          </button>
          {expanded === "mbti" && (
            <div className="personality-desc">
              <strong>{mbtiType}</strong> — {mbtiInfo[mbtiType] || "A unique personality type with distinctive strengths."}
            </div>
          )}
        </div>
      )}

      {/* RIASEC */}
      <div className="personality-section">
        <p className="personality-section-label">Top RIASEC Types</p>
        <div className="riasec-chips">
          {topRIASEC.map((type) => {
            const info = riasecInfo[type];
            return (
              <div key={type} className="riasec-chip-wrapper">
                <button
                  type="button"
                  className={`riasec-chip ${expanded === type ? "expanded" : ""}`}
                  style={{ background: info.color, borderColor: info.accent }}
                  onClick={() => setExpanded(expanded === type ? null : type)}
                >
                  <span className="riasec-emoji">{info.emoji}</span>
                  <span className="riasec-chip-label" style={{ color: info.accent }}>
                    {type} — {info.label}
                  </span>
                  <span className="riasec-chevron" style={{ color: info.accent }}>
                    {expanded === type ? "▲" : "▼"}
                  </span>
                </button>
                {expanded === type && (
                  <div className="personality-desc">{info.desc}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Assessment History Panel ─────────────────────────────
function HistoryPanel({ isOpen, onClose }) {
  const history = JSON.parse(localStorage.getItem("coursify_history") || "[]");

  if (!isOpen) return null;

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h3>Assessment History</h3>
          <button type="button" className="history-close" onClick={onClose}>✕</button>
        </div>
        {history.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">📭</span>
            <p>No previous assessments yet.</p>
            <p className="history-empty-sub">Each time you retake, results are saved here.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((entry, i) => (
              <div key={i} className="history-entry">
                <div className="history-entry-header">
                  <span className="history-date">{entry.date}</span>
                  <span className="history-strand">{entry.strand}</span>
                </div>
                <div className="history-courses">
                  {(entry.recommendations || []).slice(0, 3).map((r, j) => (
                    <div key={j} className="history-course-row">
                      <span className="history-course-name">{r.course}</span>
                      <span className="history-course-score">{r.matchScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const { recommendations, hasResults, assessmentAnswers, strand } = useRecommendations();
  const [historyOpen, setHistoryOpen] = useState(false);
  const userName = sessionStorage.getItem("coursify_user") || "Student";

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <main className="dashboard-body">

          {/* ── LEFT: Main Content ── */}
          <div className="dashboard-center">

            {/* Top Bar */}
            <div className="dash-topbar">
              <h2 className="dash-page-title">Recommended Courses</h2>
              <button
                type="button"
                className="history-icon-btn"
                onClick={() => setHistoryOpen(true)}
                title="View Assessment History"
                aria-label="View assessment history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3z" opacity="0"/>
                  <polyline points="12 8 12 12 14 14"/>
                  <path d="M3.05 11a9 9 0 1 0 .5-3"/>
                  <polyline points="3 4 3 11 10 11"/>
                </svg>
                History
              </button>
            </div>

            {/* Subtitle */}
            <p className="dash-subtitle">
              {hasResults
                ? `Based on your assessment · Strand: ${strand || ""}`
                : "Take the assessment to get personalized course recommendations."}
            </p>

            {/* Course Cards */}
            {hasResults ? (
              <div className="dash-cards">
                {recommendations.map((item) => (
                  <CourseCard
                    key={item.id}
                    id={item.id}
                    course={item.course}
                    matchScore={item.matchScore}
                    reason={item.reason}
                    careerPaths={item.careerPaths}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No recommendations yet</h3>
                <p>Take the assessment so we can tailor course recommendations to your profile.</p>
                <button
                  type="button"
                  className="primary-btn-assess"
                  onClick={() => navigate("/assessment")}
                >
                  Start Assessment →
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar Panels ── */}
          <aside className="dashboard-right">

            {/* User Card */}
            <div className="user-card">
              <div className="user-avatar" aria-hidden="true">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <p className="user-name">{userName}</p>
                <p className="user-role">SHS Student</p>
              </div>
            </div>

            {/* Calendar */}
            <Calendar />

            {/* Personality Profile */}
            <PersonalityPanel assessmentAnswers={assessmentAnswers} />

          </aside>
        </main>
      </div>

      {/* History Drawer */}
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}

export default Dashboard;