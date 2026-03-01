import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRecommendations } from "../hooks/useRecommendation";
import "../styles/CourseDetail.css";

function getScoreClass(score) {
  if (score >= 80) return "high-score";
  if (score >= 60) return "medium-score";
  return "low-score";
}

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useRecommendations();
  const data = getCourseById(id);

  if (!data) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Header />
          <main className="dashboard">
            <section className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Course not found</h3>
              <p>Please complete the assessment first to view course details.</p>
              <button
                type="button"
                className="primary-btn-assess"
                onClick={() => navigate("/assessment")}
              >
                Take Assessment →
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
        <Header />
        <main className="dashboard">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Recommendations
          </button>

          {/* Hero */}
          <section className="detail-hero">
            <div>
              <h2 className="detail-title">{data.course}</h2>
              <p className="detail-reason">{data.reason}</p>
            </div>
            <span className={`match-score ${getScoreClass(data.matchScore)}`}>
              Match Score: {data.matchScore}%
            </span>
          </section>

          {/* About */}
          <article className="detail-card">
            <h3>About this Course</h3>
            <p className="detail-desc">{data.description}</p>
          </article>

          {/* Why Recommended */}
          <article className="detail-card">
            <h3>Why This Was Recommended For You</h3>
            <ul className="why-list">
              {(data.whyRecommended || [data.reason]).map((reason, i) => (
                <li key={i}>
                  <span className="why-icon" aria-hidden="true">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          </article>

          {/* Career Paths */}
          <article className="detail-card">
            <h3>Possible Career Paths</h3>
            <ul className="career-list">
              {data.careerPaths.map((career, i) => (
                <li key={i}>
                  <span className="career-dot" aria-hidden="true" />
                  {career}
                </li>
              ))}
            </ul>
          </article>

          {/* CTA */}
          <section className="detail-cta">
            <p>Want better recommendations?</p>
            <button
              type="button"
              className="cta-btn"
              onClick={() => navigate("/assessment")}
            >
              Retake Assessment →
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}

export default CourseDetail;