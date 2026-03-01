import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRecommendations } from "../hooks/useRecommendation";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { recommendations, hasResults, strand } = useRecommendations();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard">
          <div className="dashboard-header">
            <h2>Recommended Courses</h2>
            <p>
              {hasResults
                ? `Based on your assessment — Strand: ${strand || ""}`
                : "Complete the assessment to get your personalized recommendations."}
            </p>
          </div>

          {hasResults ? (
            <section className="recommendations" aria-label="Course recommendations">
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
            </section>
          ) : (
            <section className="empty-state" aria-label="No recommendations yet">
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
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;