import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAssessment } from "../context/Assessmentcontext";
import "../styles/CourseDetail.css";

function getScoreClass(score) {
  if (score >= 80) return "high-score";
  if (score >= 60) return "medium-score";
  return "low-score";
}

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recommendations } = useAssessment();

  // Find the course from context recommendations
  const data = recommendations?.find((r) => r.id === parseInt(id));

  if (!data) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Course not found</h3>
            <p>Please complete the assessment first to view course details.</p>
            <button className="primary-btn-assess" onClick={() => navigate("/assessment")}>
              Take Assessment →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard">

        {/* Back button */}
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Recommendations
        </button>

        {/* Hero */}
        <div className="detail-hero">
          <div>
            <h2 className="detail-title">{data.course}</h2>
            <p className="detail-reason">{data.reason}</p>
          </div>
          <span className={`match-score ${getScoreClass(data.matchScore)}`}>
            Match Score: {data.matchScore}%
          </span>
        </div>

        {/* About */}
        <div className="detail-card">
          <h3>About this Course</h3>
          <p className="detail-desc">{data.description}</p>
        </div>

        {/* Why Recommended */}
        <div className="detail-card">
          <h3>Why This Was Recommended For You</h3>
          <ul className="why-list">
            {(data.whyRecommended || [data.reason]).map((reason, i) => (
              <li key={i}>
                <span className="why-icon">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Career Paths */}
        <div className="detail-card">
          <h3>Possible Career Paths</h3>
          <ul className="career-list">
            {data.careerPaths.map((career, i) => (
              <li key={i}>
                <span className="career-dot" />
                {career}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="detail-cta">
          <p>Want better recommendations?</p>
          <button className="cta-btn" onClick={() => navigate("/assessment")}>
            Retake Assessment →
          </button>
        </div>

      </main>
    </div>
  );
}

export default CourseDetail;