import CourseCard from "../components/CourseCard";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard() {
    const recommendations = [
        {
            id: 1,
            course: "BS Computer Science",
            matchScore: 92,
            reason: "Strong analytical skills and high interest in programming."
        },
        {
            id: 2,
            course: "BS Information Technology",
            matchScore: 85,
            reason: "Good technical aptitude and problem-solving ability."
        },
        {
            id: 3,
            course: "BS Information Systems",
            matchScore: 67,
            reason: "Balanced interest in business and technology."
        }
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />

            {/* Main Content */}
            <main className="dashboard">
                <div className="dashboard-header">
                    <h2>Recommended Courses</h2>
                    <p>Based on your assessment results</p>
                </div>

                <div className="recommendations">
                    {recommendations.map((item) => (
                        <CourseCard
                            key={item.id}
                            course={item.course}
                            matchScore={item.matchScore}
                            reason={item.reason}
                        />
                    ))}
                </div>
            </main>

        </div>
    );
}

export default Dashboard;
