import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Sidebar from "../components/Sidebar";
import { useAssessment } from "../context/Assessmentcontext";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { recommendations, assessmentAnswers } = useAssessment();

  const handleLogout = () => navigate("/");

  // Fallback if user hasn't taken assessment yet
  const hasResults = recommendations && recommendations.length > 0;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard">

        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        <div className="dashboard-header">
          <h2>Recommended Courses</h2>
          <p>
            {hasResults
              ? `Based on your assessment — Strand: ${assessmentAnswers?.strand || ""}`
              : "Complete the assessment to get your personalized recommendations."}
          </p>
        </div>

        {hasResults ? (
          <div className="recommendations">
            {recommendations.map((item) => (
              <CourseCard
                key={item.id}
                id={item.id}
                course={item.course}
                matchScore={item.matchScore}
                reason={item.reason}
              />
            ))}
          </div>
        ) : (
          // Empty state — nudge user to take assessment
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No recommendations yet</h3>
            <p>Take the assessment so we can tailor course recommendations to your profile.</p>
            <button className="primary-btn-assess" onClick={() => navigate("/assessment")}>
              Start Assessment →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;