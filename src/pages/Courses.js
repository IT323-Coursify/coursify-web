import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Courses.css";


const coursesData = [
  {
    id: '1',
    title: 'Engineering',
    description: 'Study of designing, building, and maintaining structures, machines, and systems across various engineering fields.',
    duration: '5 years',
    careerPaths: [
      'Civil Engineer',
      'Electrical Engineer',
      'Mechanical Engineer',
      'Geodetic Engineer',
      'Environmental Engineer',
      'Naval Architect'
    ],
    futureWork: [
      'Design infrastructure like roads and buildings',
      'Develop electrical systems and power solutions',
      'Create mechanical machines and tools',
      'Work on environmental sustainability projects',
      'Design marine vessels and offshore structures'
    ]
  },
  {
    id: '2',
    title: 'Computer Science and Information Systems',
    description: 'Focuses on computing, software development, and managing information systems in organizations.',
    duration: '4 years',
    careerPaths: [
      'Software Developer',
      'IT Specialist',
      'Data Scientist',
      'System Analyst'
    ],
    futureWork: [
      'Develop software applications',
      'Manage databases and systems',
      'Analyze and interpret data',
      'Create IT solutions for businesses',
      'Design and maintain networks'
    ]
  },
  {
    id: '3',
    title: 'Technology',
    description: 'Hands-on study of industrial and technical systems used in modern industries and production.',
    duration: '4 years',
    careerPaths: [
      'Technician',
      'Automation Specialist',
      'Manufacturing Engineer',
      'Energy Systems Manager'
    ],
    futureWork: [
      'Operate and maintain machines',
      'Develop automated systems',
      'Improve manufacturing processes',
      'Work on energy efficiency projects',
      'Handle technical repairs and diagnostics'
    ]
  },
  {
    id: '4',
    title: 'Life Sciences',
    description: 'Study of living organisms, agriculture, and environmental sustainability.',
    duration: '4 years',
    careerPaths: [
      'Agriculturist',
      'Marine Biologist',
      'Horticulturist',
      'Animal Scientist'
    ],
    futureWork: [
      'Manage farms and agricultural systems',
      'Conduct marine research',
      'Develop sustainable farming techniques',
      'Work in environmental conservation',
      'Improve food production systems'
    ]
  },
  {
    id: '5',
    title: 'Natural Sciences',
    description: 'Focus on scientific principles in mathematics, physics, chemistry, and environmental science.',
    duration: '4 years',
    careerPaths: [
      'Scientist',
      'Research Analyst',
      'Laboratory Technician',
      'Environmental Specialist'
    ],
    futureWork: [
      'Conduct scientific research',
      'Work in laboratories',
      'Analyze environmental data',
      'Develop scientific solutions',
      'Teach and share scientific knowledge'
    ]
  },
  {
    id: '6',
    title: 'Social Sciences',
    description: 'Study of society, education, and human behavior in different social contexts.',
    duration: '4 years',
    careerPaths: [
      'Teacher',
      'Social Worker',
      'Community Development Officer',
      'Vocational Instructor'
    ],
    futureWork: [
      'Teach in schools and institutions',
      'Work with communities and social programs',
      'Develop educational materials',
      'Support social welfare initiatives',
      'Train students in technical skills'
    ]
  },
  {
    id: '7',
    title: 'Art and Humanities',
    description: 'Focus on creative design, culture, and human expression through architecture and arts.',
    duration: '5 years',
    careerPaths: [
      'Architect',
    ],
    futureWork: [
      'Design buildings and structures',
      'Plan urban spaces',
      'Create architectural drawings',
      'Work on construction projects',
      'Develop sustainable design concepts'
    ]
  }
];

function CourseModal({ course, onClose }) {
  if (!course) return null;

  const getScoreClass = (score) => {
    if (score >= 80) return "high-score";
    if (score >= 60) return "medium-score";
    return "low-score";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{course.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-duration">
          <span className="duration-badge">⏱ Duration: {course.duration}</span>
        </div>

        <div className="modal-section">
          <h3>📖 About This Course</h3>
          <p>{course.description}</p>
        </div>

        <div className="modal-section">
          <h3>💼 Career Paths</h3>
          <ul className="career-list">
            {course.careerPaths.map((career, index) => (
              <li key={index}>
                <span className="career-dot"></span>
                {career}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3>🚀 Future Work Aligned With This Course</h3>
          <ul className="future-work-list">
            {course.futureWork.map((work, index) => (
              <li key={index}>
                <span className="checkmark">✓</span>
                {work}
              </li>
            ))}
          </ul>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function CourseCard({ course, onViewDetails }) {
  return (
    <div className="course-card" onClick={() => onViewDetails(course)}>
      <div className="course-card-header">
        <h3 className="course-card-title">{course.title}</h3>
        <span className="course-duration">{course.duration}</span>
      </div>
      <p className="course-card-description">{course.description.substring(0, 120)}...</p>
      <div className="course-card-footer">
        <span className="view-details">Click for details →</span>
      </div>
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard">
          <div className="courses-header">
            <h2>All Courses</h2>
            <p>Explore our comprehensive course offerings. Click any course card to see detailed information and future work opportunities.</p>
          </div>

          <div className="courses-grid">
            {coursesData.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </main>
      </div>

      {modalOpen && (
        <CourseModal course={selectedCourse} onClose={handleCloseModal} />
      )}
    </div>
  );
}