import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useLatestResult } from "../hooks/useLatestResult";
import "../styles/Dashboard.css";

// ─────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────

const RIASEC_META = {
  realistic:      { label: "Realistic",      code: "R", emoji: "🔧", color: "#dbeafe", accent: "#2563eb" },
  investigative:  { label: "Investigative",  code: "I", emoji: "🔬", color: "#dcfce7", accent: "#16a34a" },
  artistic:       { label: "Artistic",       code: "A", emoji: "🎨", color: "#f3e8ff", accent: "#9333ea" },
  social:         { label: "Social",         code: "S", emoji: "🤝", color: "#ffedd5", accent: "#ea580c" },
  enterprising:   { label: "Enterprising",   code: "E", emoji: "🚀", color: "#fef9c3", accent: "#ca8a04" },
  conventional:   { label: "Conventional",   code: "C", emoji: "📋", color: "#dcfce7", accent: "#15803d" },
};

const RIASEC_DESC = {
  realistic:     "You prefer hands-on, practical work with tools, machines, or nature. Independent, stable, and persistent.",
  investigative: "You enjoy analytical problem-solving and intellectual exploration. Curious, precise, and research-driven.",
  artistic:      "You are imaginative and expressive, thriving in creative, unstructured environments.",
  social:        "You enjoy helping and teaching others. Empathetic, cooperative, and service-oriented.",
  enterprising:  "You are persuasive and energetic, drawn to leadership, business, and entrepreneurship.",
  conventional:  "You excel in structured, orderly work — data management, accounting, and administration.",
};

const BIGFIVE_META = {
  openness:          { label: "Openness",           abbr: "O", low: "Practical & conventional",  high: "Curious & imaginative"   },
  conscientiousness: { label: "Conscientiousness",  abbr: "C", low: "Flexible & spontaneous",   high: "Organized & disciplined"  },
  extraversion:      { label: "Extraversion",       abbr: "E", low: "Reflective & reserved",    high: "Energetic & sociable"     },
  agreeableness:     { label: "Agreeableness",      abbr: "A", low: "Direct & competitive",     high: "Cooperative & empathetic" },
  neuroticism:       { label: "Neuroticism",        abbr: "N", low: "Calm & resilient",         high: "Sensitive & reactive"     },
};

const APTITUDE_META = {
  math:     { label: "Math",             emoji: "🔢", color: "#dbeafe", accent: "#2563eb" },
  english:  { label: "English",          emoji: "📖", color: "#f3e8ff", accent: "#9333ea" },
  science:  { label: "Science",          emoji: "⚗️", color: "#dcfce7", accent: "#16a34a" },
  abstract: { label: "Abstract",         emoji: "🧩", color: "#fef9c3", accent: "#ca8a04" },
};

function traitLevel(mean) {
  // mean is 1–5
  if (mean >= 4.0) return "High";
  if (mean >= 2.5) return "Medium";
  return "Low";
}

function traitColor(level) {
  return level === "High" ? "#16a34a" : level === "Medium" ? "#ca8a04" : "#94a3b8";
}

function traitBg(level) {
  return level === "High" ? "#dcfce7" : level === "Medium" ? "#fef9c3" : "#f1f5f9";
}

// ─────────────────────────────────────────────────────────
// Calendar
// ─────────────────────────────────────────────────────────

function Calendar() {
  const [current, setCurrent] = useState(new Date());
  const year  = current.getFullYear();
  const month = current.getMonth();
  const today = new Date();

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const firstDay   = new Date(year, month, 1).getDay();
  const offset     = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <span className="cal-month">{monthNames[month]} {year}</span>
        <div className="cal-nav">
          <button type="button" onClick={() => setCurrent(new Date(year, month - 1, 1))} className="cal-nav-btn">‹</button>
          <button type="button" onClick={() => setCurrent(new Date(year, month + 1, 1))} className="cal-nav-btn">›</button>
        </div>
      </div>
      <div className="cal-grid">
        {dayNames.map(d => <span key={d} className="cal-day-label">{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={`cal-cell ${d === null ? "cal-empty" : ""} ${isToday(d) ? "cal-today" : ""}`}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// History Drawer
// ─────────────────────────────────────────────────────────

function HistoryPanel({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_BASE}/api/assessment/results/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h3>Assessment History</h3>
          <button type="button" className="history-close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="history-empty">
            <span className="history-empty-icon">⏳</span>
            <p>Loading history…</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">📭</span>
            <p>No previous assessments yet.</p>
            <p className="history-empty-sub">Each time you submit, results are saved here.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((entry, i) => (
              <div key={i} className="history-entry">
                <div className="history-entry-header">
                  <span className="history-date">
                    {new Date(entry.submittedAt).toLocaleDateString("en-PH", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </span>
                  <span className="history-strand">{entry.strand}</span>
                </div>
                <div className="history-courses">
                  {(entry.recommendations || []).slice(0, 3).map((r, j) => (
                    <div key={j} className="history-course-row">
                      <span className="history-course-name">{r.course}</span>
                      <span className="history-course-score">{r.confidence}%</span>
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

// ─────────────────────────────────────────────────────────
// Section: AI Profile Summary
// ─────────────────────────────────────────────────────────

function ProfileSummarySection({ result }) {
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!result) return;
    setLoading(true);

    const { scores, strand } = result;
    const { riasec_raw, bigfive_raw, aptitude_pct } = scores;

    // Build top RIASEC codes
    const topRIASEC = Object.entries(riasec_raw)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => RIASEC_META[k]?.code || k.toUpperCase())
      .join("");

    // Build Big Five summary
    const bigFiveSummary = Object.entries(bigfive_raw)
      .map(([trait, val]) => `${BIGFIVE_META[trait]?.label || trait}: ${traitLevel(val)}`)
      .join(", ");

    // Top aptitude
    const topApt = Object.entries(aptitude_pct)
      .sort((a, b) => b[1] - a[1])[0];

    const prompt = `
You are an academic guidance counselor writing a warm, encouraging profile summary for a Senior High School student.

Their assessment results:
- Strand: ${strand}
- RIASEC top 3 codes: ${topRIASEC} (${topRIASEC.split("").map(c =>
        Object.values(RIASEC_META).find(m => m.code === c)?.label
      ).join(", ")})
- Big Five: ${bigFiveSummary}
- Top aptitude subject: ${APTITUDE_META[topApt?.[0]]?.label || topApt?.[0]} (${topApt?.[1]}%)

Write 3–4 sentences max. Be specific, warm, and grounded in their actual results. 
Focus on their strengths and how their personality connects to their top courses. 
Do not use bullet points. Do not repeat the numbers verbatim.
`.trim();

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_BASE}/api/ai/profile-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ prompt }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => setSummary(data?.summary || null))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [result]);

  if (!result) return null;

  return (
    <div className="dash-section profile-summary-section">
      <div className="section-header">
        <span className="section-icon">✨</span>
        <h3 className="section-title">Your Profile Summary</h3>
        <span className="section-badge">{result.strand}</span>
      </div>

      {loading ? (
        <div className="summary-loading">
          <div className="summary-shimmer" />
          <div className="summary-shimmer short" />
        </div>
      ) : summary ? (
        <p className="summary-text">{summary}</p>
      ) : (
        <p className="summary-text summary-fallback">
          Your results show a unique blend of strengths across personality, aptitude, and interests.
          Explore the sections below to learn more about your profile.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Section: RIASEC Results
// ─────────────────────────────────────────────────────────

function RIASECSection({ riasec_raw }) {
  const [expanded, setExpanded] = useState(null);

  const sorted = Object.entries(riasec_raw).sort((a, b) => b[1] - a[1]);
  const topKeys = sorted.slice(0, 3).map(([k]) => k);

  return (
    <div className="dash-section">
      <div className="section-header">
        <span className="section-icon">🧭</span>
        <h3 className="section-title">RIASEC Interest Profile</h3>
        <span className="section-sub">Top 3: {topKeys.map(k => RIASEC_META[k]?.code).join("")}</span>
      </div>

      <div className="riasec-bars">
        {sorted.map(([key, raw], idx) => {
          const meta  = RIASEC_META[key];
          const pct   = Math.round((raw / 30) * 100);
          const isTop = topKeys.includes(key);

          return (
            <div key={key} className={`riasec-row ${isTop ? "riasec-top" : ""}`}>
              <div className="riasec-row-label">
                <span className="riasec-emoji-sm">{meta.emoji}</span>
                <span className="riasec-code-name">
                  <strong>{meta.code}</strong>
                  <span>{meta.label}</span>
                </span>
                {isTop && idx === 0 && <span className="riasec-crown">👑</span>}
              </div>

              <div className="riasec-bar-wrap">
                <div
                  className="riasec-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: isTop ? meta.accent : "#e2e8f0",
                  }}
                />
              </div>

              <div className="riasec-row-right">
                <span className="riasec-score" style={{ color: isTop ? meta.accent : "#94a3b8" }}>
                  {raw}<span className="riasec-max">/30</span>
                </span>
                <button
                  type="button"
                  className="riasec-toggle"
                  onClick={() => setExpanded(expanded === key ? null : key)}
                  aria-label="Toggle description"
                >
                  {expanded === key ? "▲" : "▼"}
                </button>
              </div>

              {expanded === key && (
                <div
                  className="riasec-desc"
                  style={{ borderLeftColor: meta.accent, background: meta.color }}
                >
                  {RIASEC_DESC[key]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Section: Big Five
// ─────────────────────────────────────────────────────────

function BigFiveSection({ bigfive_raw }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="dash-section">
      <div className="section-header">
        <span className="section-icon">🧠</span>
        <h3 className="section-title">Big Five Personality</h3>
      </div>

      <div className="bigfive-grid">
        {Object.entries(bigfive_raw).map(([trait, mean]) => {
          const meta  = BIGFIVE_META[trait];
          const level = traitLevel(mean);
          const pct   = Math.round(((mean - 1) / 4) * 100);
          const isOpen = expanded === trait;

          return (
            <div key={trait} className={`bigfive-card ${isOpen ? "bf-open" : ""}`}>
              <div className="bf-card-top">
                <div className="bf-label-row">
                  <span
                    className="bf-abbr"
                    style={{ background: traitBg(level), color: traitColor(level) }}
                  >
                    {meta.abbr}
                  </span>
                  <span className="bf-name">{meta.label}</span>
                </div>
                <span
                  className="bf-level-badge"
                  style={{ background: traitBg(level), color: traitColor(level) }}
                >
                  {level}
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="bf-bar-track">
                <div
                  className="bf-bar-fill"
                  style={{ width: `${pct}%`, background: traitColor(level) }}
                />
              </div>

              <button
                type="button"
                className="bf-expand-btn"
                onClick={() => setExpanded(isOpen ? null : trait)}
              >
                {isOpen ? "Hide details ▲" : "What this means ▼"}
              </button>

              {isOpen && (
                <div className="bf-detail">
                  <div className="bf-spectrum">
                    <span className="bf-spectrum-low">{meta.low}</span>
                    <span className="bf-spectrum-arrow">↔</span>
                    <span className="bf-spectrum-high">{meta.high}</span>
                  </div>
                  <p className="bf-interpretation">
                    {level === "High"
                      ? `Your ${meta.label.toLowerCase()} is high — ${meta.high.toLowerCase()}.`
                      : level === "Low"
                      ? `Your ${meta.label.toLowerCase()} is low — ${meta.low.toLowerCase()}.`
                      : `You score in the middle range for ${meta.label.toLowerCase()}, balancing both ends.`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Section: Aptitude
// ─────────────────────────────────────────────────────────

function AptitudeSection({ aptitude_pct }) {
  const sorted = Object.entries(aptitude_pct).sort((a, b) => b[1] - a[1]);

  return (
    <div className="dash-section">
      <div className="section-header">
        <span className="section-icon">📚</span>
        <h3 className="section-title">Aptitude Scores</h3>
        <span className="section-sub">12 questions per subject</span>
      </div>

      <div className="aptitude-grid">
        {sorted.map(([subj, pct]) => {
          const meta    = APTITUDE_META[subj];
          const correct = Math.round((pct / 100) * 12);
          const grade   = pct >= 75 ? "apt-high" : pct >= 50 ? "apt-med" : "apt-low";

          return (
            <div key={subj} className={`aptitude-card ${grade}`}>
              <div className="apt-icon">{meta.emoji}</div>
              <div className="apt-label">{meta.label}</div>
              <div className="apt-score-row">
                <span className="apt-score">{correct}</span>
                <span className="apt-max">/12</span>
              </div>
              <div className="apt-pct-bar">
                <div
                  className="apt-pct-fill"
                  style={{ width: `${pct}%`, background: meta.accent }}
                />
              </div>
              <div className="apt-pct-label" style={{ color: meta.accent }}>{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Section: Top Recommended Courses
// ─────────────────────────────────────────────────────────

const MEDAL = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

function CourseSection({ recommendations }) {
  return (
    <div className="dash-section">
      <div className="section-header">
        <span className="section-icon">🎯</span>
        <h3 className="section-title">Top Recommended Courses</h3>
        <span className="section-sub">ML-ranked by fit</span>
      </div>

      <div className="course-list">
        {recommendations.map((item, i) => {
          const conf  = item.confidence;
          const grade = conf >= 30 ? "conf-high" : conf >= 15 ? "conf-med" : "conf-low";

          return (
            <div key={i} className={`course-row ${i === 0 ? "course-top" : ""}`}>
              <span className="course-medal">{MEDAL[i] || `${i + 1}.`}</span>
              <span className="course-name">{item.course}</span>
              <div className="course-conf-wrap">
                <div className="course-conf-bar-track">
                  <div
                    className="course-conf-bar-fill"
                    style={{ width: `${Math.min(conf * 2, 100)}%` }}
                  />
                </div>
                <span className={`course-conf-badge ${grade}`}>{conf}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────

function EmptyState({ navigate }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h3>No assessment results yet</h3>
      <p>Take the assessment so we can build your full profile — RIASEC, Big Five, aptitude scores, and personalized course recommendations.</p>
      <button type="button" className="primary-btn-assess" onClick={() => navigate("/assessment")}>
        Start Assessment →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();
  const { result, loading, error } = useLatestResult();
  const [historyOpen, setHistoryOpen] = useState(false);

  const userName = (() => {
    try { return JSON.parse(localStorage.getItem("coursify_user"))?.username || "Student"; }
    catch { return "Student"; }
  })();

  const hasResults = !!result;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <main className="dashboard-body">

          {/* ── LEFT: main content ── */}
          <div className="dashboard-center">

            {/* Top bar */}
            <div className="dash-topbar">
              <div>
                <h2 className="dash-page-title">Dashboard</h2>
                <p className="dash-subtitle">
                  {hasResults
                    ? `Last assessment · Strand: ${result.strand} · ${new Date(result.submittedAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}`
                    : "Complete the assessment to unlock your full profile."}
                </p>
              </div>
              <button
                type="button"
                className="history-icon-btn"
                onClick={() => setHistoryOpen(true)}
                title="View Assessment History"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="12 8 12 12 14 14"/>
                  <path d="M3.05 11a9 9 0 1 0 .5-3"/>
                  <polyline points="3 4 3 11 10 11"/>
                </svg>
                History
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="dash-loading">
                <div className="loading-spinner" />
                <p>Loading your profile…</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="dash-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* No results */}
            {!loading && !error && !hasResults && (
              <EmptyState navigate={navigate} />
            )}

            {/* Full profile sections */}
            {!loading && !error && hasResults && (() => {
              const { scores, recommendations } = result;
              return (
                <div className="profile-sections">
                  <ProfileSummarySection result={result} />
                  <RIASECSection   riasec_raw   ={scores.riasec_raw}   />
                  <BigFiveSection  bigfive_raw  ={scores.bigfive_raw}  />
                  <AptitudeSection aptitude_pct ={scores.aptitude_pct} />
                  <CourseSection   recommendations={recommendations}   />
                </div>
              );
            })()}
          </div>

          {/* ── RIGHT: sidebar panels ── */}
          <aside className="dashboard-right">
            <div className="user-card">
              <div className="user-avatar" aria-hidden="true">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <p className="user-name">{userName}</p>
                <p className="user-role">SHS Student</p>
              </div>
            </div>

            <Calendar />

            {hasResults && (
              <div className="quick-stats-card">
                <p className="panel-title">Quick Stats</p>
                <div className="qs-row">
                  <span className="qs-label">Top RIASEC</span>
                  <span className="qs-value">
                    {Object.entries(result.scores.riasec_raw)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([k]) => RIASEC_META[k]?.code)
                      .join("")}
                  </span>
                </div>
                <div className="qs-row">
                  <span className="qs-label">Best Subject</span>
                  <span className="qs-value">
                    {APTITUDE_META[
                      Object.entries(result.scores.aptitude_pct).sort((a, b) => b[1] - a[1])[0]?.[0]
                    ]?.label}
                  </span>
                </div>
                <div className="qs-row">
                  <span className="qs-label">Top Course</span>
                  <span className="qs-value qs-course">
                    {result.recommendations[0]?.course?.replace(/^BS /, "")}
                  </span>
                </div>
                <div className="qs-row">
                  <span className="qs-label">Confidence</span>
                  <span className="qs-value">{result.recommendations[0]?.confidence}%</span>
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}

export default Dashboard;