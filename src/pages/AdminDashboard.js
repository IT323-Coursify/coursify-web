import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

// ─── Static Data ─────────────────────────────────────────────────────────────

const initialStudents = [
  { id: "STU-001", strand: "STEM",  mbti: "INTJ", riasec: "I, R, C", status: "Done",        rec: "Computer Science",   match: 92 },
  { id: "STU-002", strand: "ABM",   mbti: "ENTJ", riasec: "E, C, S", status: "Done",        rec: "Business Mgmt",      match: 88 },
  { id: "STU-003", strand: "HUMSS", mbti: "INFJ", riasec: "S, A, I", status: "Pending",     rec: "Social Work",        match: 84 },
  { id: "STU-004", strand: "STEM",  mbti: "INTP", riasec: "I, R, A", status: "Done",        rec: "Data Science",       match: 90 },
  { id: "STU-005", strand: "TVL",   mbti: "ISTP", riasec: "R, C, E", status: "Not Started", rec: "—",                  match: null },
  { id: "STU-006", strand: "STEM",  mbti: "ENTP", riasec: "I, E, R", status: "Done",        rec: "Electrical Eng",     match: 86 },
  { id: "STU-007", strand: "GAS",   mbti: "ISFJ", riasec: "S, C, R", status: "Done",        rec: "Education",          match: 79 },
  { id: "STU-008", strand: "HUMSS", mbti: "ENFJ", riasec: "S, E, A", status: "Done",        rec: "Architecture",       match: 83 },
  { id: "STU-009", strand: "ABM",   mbti: "ESTP", riasec: "E, R, S", status: "Pending",     rec: "—",                  match: null },
  { id: "STU-010", strand: "TVL",   mbti: "ISTJ", riasec: "C, R, I", status: "Done",        rec: "Electronics Tech",   match: 81 },
];

const initialCourses = [
  { name: "Computer Science",       program: "CS & IS",          duration: "4 years", status: "Active"   },
  { name: "Information Technology", program: "CS & IS",          duration: "4 years", status: "Active"   },
  { name: "Data Science",           program: "CS & IS",          duration: "4 years", status: "Active"   },
  { name: "Civil Engineering",      program: "Engineering",      duration: "5 years", status: "Active"   },
  { name: "Electrical Engineering", program: "Engineering",      duration: "5 years", status: "Active"   },
  { name: "Architecture",           program: "Art & Humanities", duration: "5 years", status: "Active"   },
  { name: "Marine Biology",         program: "Life Sciences",    duration: "4 years", status: "Inactive" },
  { name: "Social Work",            program: "Social Sciences",  duration: "4 years", status: "Active"   },
];

const initialCriteria = [
  "RIASEC-I", "RIASEC-R", "RIASEC-A", "RIASEC-S", "RIASEC-E", "RIASEC-C",
  "MBTI-INT", "MBTI-ENT", "STEM", "Math", "Science", "Tech", "Creative", "Leadership",
];

const topCourses = [
  { name: "Computer Science",       pct: 78 },
  { name: "Electrical Engineering", pct: 62 },
  { name: "Data Science",           pct: 59 },
  { name: "Architecture",           pct: 47 },
  { name: "Social Work",            pct: 44 },
  { name: "Civil Engineering",      pct: 41 },
];

const riasecData = [
  { type: "I – Investigative", pct: 28, color: "#4da3f5" },
  { type: "R – Realistic",     pct: 22, color: "#2bbbad" },
  { type: "S – Social",        pct: 18, color: "#FBB217" },
  { type: "E – Enterprising",  pct: 14, color: "#9333ea" },
  { type: "A – Artistic",      pct: 11, color: "#ec4899" },
  { type: "C – Conventional",  pct:  7, color: "#64748b" },
];

const reviewsData = [
  { id: "STU-001", strand: "STEM",  mbti: "INTJ", riasec: "I, R, C", date: "Mar 31, 2026",
    courses: [{ name: "Computer Science", score: 92 }, { name: "Data Science", score: 88 }, { name: "Comp. Engineering", score: 84 }] },
  { id: "STU-002", strand: "ABM",   mbti: "ENTJ", riasec: "E, C, S", date: "Mar 31, 2026",
    courses: [{ name: "Business Mgmt", score: 88 }, { name: "Entrepreneurship", score: 83 }, { name: "Accounting", score: 79 }] },
  { id: "STU-003", strand: "HUMSS", mbti: "INFJ", riasec: "S, A, I", date: "Mar 30, 2026",
    courses: [{ name: "Social Work", score: 84 }, { name: "Psychology", score: 80 }, { name: "Comm Arts", score: 76 }] },
  { id: "STU-004", strand: "STEM",  mbti: "INTP", riasec: "I, R, A", date: "Mar 30, 2026",
    courses: [{ name: "Data Science", score: 90 }, { name: "Applied Math", score: 87 }, { name: "Applied Physics", score: 82 }] },
  { id: "STU-006", strand: "STEM",  mbti: "ENTP", riasec: "I, E, R", date: "Mar 29, 2026",
    courses: [{ name: "Electrical Eng", score: 86 }, { name: "Computer Eng", score: 83 }, { name: "Electronics Eng", score: 80 }] },
];

// ─── Reusable Badge ───────────────────────────────────────────────────────────

function Badge({ type, children }) {
  return <span className={`adm-badge adm-badge-${type}`}>{children}</span>;
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function OverviewPage() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleString("en-PH", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const recentAssessments = [
    { id: "STU-001", strand: "STEM",  status: "Done",        date: "Mar 31, 2026" },
    { id: "STU-002", strand: "ABM",   status: "Done",        date: "Mar 31, 2026" },
    { id: "STU-003", strand: "HUMSS", status: "Pending",     date: "Mar 30, 2026" },
    { id: "STU-004", strand: "STEM",  status: "Done",        date: "Mar 30, 2026" },
    { id: "STU-005", strand: "TVL",   status: "Not Started", date: "—" },
  ];

  const statusBadge = (s) =>
    s === "Done" ? "green" : s === "Pending" ? "yellow" : "red";

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div className="adm-topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome back, Administrator. Here's your system overview.</p>
          </div>
          <div className="adm-clock">{clock}</div>
        </div>
      </div>

      <div className="adm-stats-row">
        {[
          { icon: "👥", value: "248", label: "Total Students",       cls: "blue"   },
          { icon: "✅", value: "186", label: "Assessments Done",     cls: "green"  },
          { icon: "📚", value: "42",  label: "Active Courses",       cls: "yellow" },
          { icon: "🎯", value: "94%", label: "Match Accuracy",       cls: "purple" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className={`adm-stat-icon adm-icon-${s.cls}`}>{s.icon}</div>
            <div>
              <div className="adm-stat-value">{s.value}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-two-col">
        <div className="adm-card">
          <div className="adm-card-title">Recent Assessments</div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Student ID</th><th>Strand</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAssessments.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td><Badge type="blue">{r.strand}</Badge></td>
                  <td><Badge type={statusBadge(r.status)}>{r.status}</Badge></td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adm-card">
          <div className="adm-card-title">System Health</div>
          {[
            { label: "Recommendation Engine", badge: "Online",    badgeType: "green",  sub: "Last run: 2 hours ago · 186 records processed" },
            { label: "Assessment Module",      badge: "Active",    badgeType: "green",  sub: "62 students yet to complete" },
            { label: "Course Database",        badge: "Synced",    badgeType: "green",  sub: "42 courses across 7 programs" },
            { label: "Data Backup",            badge: "Scheduled", badgeType: "yellow", sub: "Next backup: Tonight 11:00 PM" },
          ].map((item, i) => (
            <div key={i} className={`adm-health-row ${i > 0 ? "adm-health-border" : ""}`}>
              <div className="adm-health-top">
                <span className="adm-health-label">{item.label}</span>
                <Badge type={item.badgeType}>{item.badge}</Badge>
              </div>
              <div className="adm-health-sub">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDataPage() {
  const [strandFilter, setStrandFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = initialStudents.filter((s) => {
    const matchStrand = !strandFilter || s.strand === strandFilter;
    const matchSearch = !search || s.id.toLowerCase().includes(search.toLowerCase());
    return matchStrand && matchSearch;
  });

  const statusBadge = (s) =>
    s === "Done" ? "green" : s === "Pending" ? "yellow" : "red";

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>Student Data Overview</h2>
        <p>Anonymized student profiles, assessment completion, and recommendation summaries.</p>
      </div>

      <div className="adm-card" style={{ marginBottom: 0 }}>
        <div className="adm-topbar" style={{ marginBottom: 18 }}>
          <div className="adm-card-title" style={{ marginBottom: 0 }}>All Students</div>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              className="adm-input"
              value={strandFilter}
              onChange={(e) => setStrandFilter(e.target.value)}
            >
              <option value="">All Strands</option>
              {["STEM", "ABM", "HUMSS", "TVL", "GAS"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              className="adm-search"
              type="text"
              placeholder="Search student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="adm-table">
          <thead>
            <tr>
              <th>Student ID</th><th>Strand</th><th>MBTI</th>
              <th>Top RIASEC</th><th>Assessment</th><th>Top Recommendation</th><th>Match</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.id}</strong></td>
                <td><Badge type="blue">{s.strand}</Badge></td>
                <td>{s.mbti}</td>
                <td>{s.riasec}</td>
                <td><Badge type={statusBadge(s.status)}>{s.status}</Badge></td>
                <td>{s.rec}</td>
                <td>
                  {s.match
                    ? <strong style={{ color: "#4da3f5" }}>{s.match}%</strong>
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseManagementPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [newCriteria, setNewCriteria] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ name: "", program: "Engineering", duration: "4 years", status: "Active" });

  const programs = [
    "Engineering", "Computer Science and Information Systems", "Technology",
    "Life Sciences", "Natural Sciences", "Social Sciences", "Art and Humanities",
  ];

  const openAdd = () => {
    setEditIdx(-1);
    setForm({ name: "", program: "Engineering", duration: "4 years", status: "Active" });
    setModalOpen(true);
  };

  const openEdit = (i) => {
    setEditIdx(i);
    setForm({ ...courses[i] });
    setModalOpen(true);
  };

  const deleteCourse = (i) => {
    if (window.confirm(`Remove "${courses[i].name}"?`)) {
      setCourses((prev) => prev.filter((_, idx) => idx !== i));
    }
  };

  const saveCourse = () => {
    if (!form.name.trim()) { alert("Course name is required."); return; }
    if (editIdx >= 0) {
      setCourses((prev) => prev.map((c, i) => (i === editIdx ? form : c)));
    } else {
      setCourses((prev) => [form, ...prev]);
    }
    setModalOpen(false);
  };

  const addCriteria = () => {
    if (!newCriteria.trim()) return;
    setCriteria((prev) => [...prev, newCriteria.trim()]);
    setNewCriteria("");
  };

  const removeCriteria = (i) => setCriteria((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div className="adm-topbar">
          <div>
            <h2>Course &amp; Criteria Management</h2>
            <p>Add, update, or remove courses and define matching criteria.</p>
          </div>
          <button className="adm-btn adm-btn-primary" onClick={openAdd}>+ Add Course</button>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">Matching Criteria Tags</div>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
          Keywords used by the recommendation engine to match students to courses.
        </p>
        <div className="adm-tag-row">
          {criteria.map((c, i) => (
            <div key={i} className="adm-tag">
              {c}
              <button className="adm-tag-remove" onClick={() => removeCriteria(i)}>×</button>
            </div>
          ))}
        </div>
        <div className="adm-input-row" style={{ marginTop: 14 }}>
          <input
            className="adm-input"
            placeholder="Add new criteria tag..."
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCriteria()}
          />
          <button className="adm-btn adm-btn-primary" onClick={addCriteria}>Add</button>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">All Courses</div>
        <table className="adm-table">
          <thead>
            <tr><th>Course</th><th>Program</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i}>
                <td><strong>{c.name}</strong></td>
                <td>{c.program}</td>
                <td>{c.duration}</td>
                <td><Badge type={c.status === "Active" ? "green" : "red"}>{c.status}</Badge></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(i)}>Edit</button>
                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => deleteCourse(i)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editIdx >= 0 ? "Edit Course" : "Add New Course"}</h3>

            <div className="adm-form-group">
              <label className="adm-form-label">Course Title</label>
              <input
                className="adm-input"
                style={{ width: "100%" }}
                placeholder="e.g. Computer Science"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Program</label>
              <select className="adm-input" style={{ width: "100%" }} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}>
                {programs.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Duration</label>
              <select className="adm-input" style={{ width: "100%" }} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <option>4 years</option>
                <option>5 years</option>
              </select>
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Status</label>
              <select className="adm-input" style={{ width: "100%" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="adm-modal-actions">
              <button className="adm-btn adm-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={saveCourse}>Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 65, cy = 65, r = 52, inner = 30;
    ctx.clearRect(0, 0, 130, 130);
    let angle = -Math.PI / 2;
    riasecData.forEach((d) => {
      const slice = (d.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += slice;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }, []);

  const strandRows = [
    { strand: "STEM",  students: 92, program: "Engineering / CS",         avg: 88, type: "green"  },
    { strand: "ABM",   students: 54, program: "Business / Social Sciences", avg: 82, type: "green"  },
    { strand: "HUMSS", students: 48, program: "Social Work / Edu",          avg: 79, type: "blue"   },
    { strand: "TVL",   students: 34, program: "Technology / Life Sciences", avg: 77, type: "blue"   },
    { strand: "GAS",   students: 20, program: "Natural Sciences",           avg: 73, type: "yellow" },
  ];

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h2>Recommendation Analytics</h2>
        <p>Trends, interest clusters, and recommendation distribution across students.</p>
      </div>

      <div className="adm-stats-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { icon: "📊", value: "186", label: "Recommendations Generated", cls: "blue"   },
          { icon: "🏆", value: "CS",  label: "Most Recommended",          cls: "green"  },
          { icon: "🔬", value: "I+R", label: "Top Interest Cluster",      cls: "yellow" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className={`adm-stat-icon adm-icon-${s.cls}`}>{s.icon}</div>
            <div>
              <div className="adm-stat-value">{s.value}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-two-col">
        <div className="adm-card">
          <div className="adm-card-title">Most Recommended Courses</div>
          {topCourses.map((c) => (
            <div key={c.name} className="adm-bar-row">
              <div className="adm-bar-label">{c.name}</div>
              <div className="adm-bar-track">
                <div className="adm-bar-fill" style={{ width: `${c.pct}%` }} />
              </div>
              <div className="adm-bar-pct">{c.pct}%</div>
            </div>
          ))}
        </div>

        <div className="adm-card">
          <div className="adm-card-title">RIASEC Interest Distribution</div>
          <div className="adm-donut-wrap">
            <canvas ref={canvasRef} width={130} height={130} />
            <div className="adm-donut-legend">
              {riasecData.map((d) => (
                <div key={d.type} className="adm-legend-row">
                  <span className="adm-legend-dot" style={{ background: d.color }} />
                  <span className="adm-legend-label">{d.type}</span>
                  <span className="adm-legend-pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-title">Strand vs. Top Program</div>
        <table className="adm-table">
          <thead>
            <tr><th>Strand</th><th>Students</th><th>Most Matched Program</th><th>Avg Match Score</th></tr>
          </thead>
          <tbody>
            {strandRows.map((r) => (
              <tr key={r.strand}>
                <td>{r.strand}</td>
                <td>{r.students}</td>
                <td>{r.program}</td>
                <td><Badge type={r.type}>{r.avg}%</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewPanelPage() {
  const [strandFilter, setStrandFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = reviewsData.filter((r) => !strandFilter || r.strand === strandFilter);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div className="adm-topbar">
          <div>
            <h2>Recommendation Review Panel</h2>
            <p>Review generated recommendations and understand how student data maps to suggested courses.</p>
          </div>
          <select
            className="adm-input"
            value={strandFilter}
            onChange={(e) => setStrandFilter(e.target.value)}
          >
            <option value="">All Strands</option>
            {["STEM", "ABM", "HUMSS", "TVL"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.map((r) => (
        <div key={r.id} className="adm-review-card">
          <div className="adm-review-header">
            <div>
              <div className="adm-review-student">
                {r.id} <Badge type="blue">{r.strand}</Badge>
              </div>
              <div className="adm-review-meta">
                MBTI: {r.mbti} &nbsp;·&nbsp; RIASEC: {r.riasec} &nbsp;·&nbsp; {r.date}
              </div>
            </div>
            <button
              className="adm-btn adm-btn-ghost adm-btn-sm"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              {expanded === r.id ? "Hide Mapping" : "View Mapping"}
            </button>
          </div>

          <div className="adm-review-courses">
            {r.courses.map((c) => (
              <div key={c.name} className="adm-course-pill">
                {c.name}
                <span className="adm-course-pill-score">{c.score}%</span>
              </div>
            ))}
          </div>

          {expanded === r.id && (
            <div className="adm-review-detail">
              <strong style={{ color: "#0284c7" }}>How the recommendation was generated:</strong>
              <br />
              The engine matched <strong>{r.id}</strong>'s RIASEC profile (<strong>{r.riasec}</strong>) and
              MBTI type (<strong>{r.mbti}</strong>) against course criteria tags. Courses with the highest
              keyword overlap scored highest. Strand ({r.strand}) was used as a secondary weight.
              Top match: <strong>{r.courses[0].name}</strong> at {r.courses[0].score}%.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

const navItems = [
  { key: "overview",  label: "Overview",       icon: "📊" },
  { key: "students",  label: "Student Data",   icon: "👥" },
  { key: "courses",   label: "Course Mgmt",    icon: "📚" },
  { key: "analytics", label: "Analytics",      icon: "📈" },
  { key: "review",    label: "Review Panel",   icon: "🔍" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");

  const handleLogout = () => {
    sessionStorage.removeItem("coursify_user");
    sessionStorage.removeItem("coursify_role");
    navigate("/");
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":  return <OverviewPage />;
      case "students":  return <StudentDataPage />;
      case "courses":   return <CourseManagementPage />;
      case "analytics": return <AnalyticsPage />;
      case "review":    return <ReviewPanelPage />;
      default:          return <OverviewPage />;
    }
  };

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          Coursify <span>Admin</span>
        </div>
        <div className="adm-admin-tag">Administrator</div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`adm-nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-sidebar-logout" onClick={handleLogout}>
            <span style={{ fontSize: 18 }}>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="adm-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default AdminDashboard;