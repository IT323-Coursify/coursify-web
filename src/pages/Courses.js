import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Courses.css";

// Programs with their courses and details
const programsData = [
  {
    id: "eng",
    title: "Engineering",
    courses: [
      { id: "civil", title: "Civil Engineering", description: "Study of designing, building, and maintaining structures like roads and bridges.", duration: "5 years", careerPaths: ["Civil Engineer", "Structural Engineer", "Construction Manager"], futureWork: ["Design infrastructure like roads and buildings","Supervise construction projects","Ensure safety and compliance in structures"] },
      { id: "electrical", title: "Electrical Engineering", description: "Focus on electrical systems, circuits, and power generation.", duration: "5 years", careerPaths: ["Electrical Engineer", "Power Systems Engineer"], futureWork: ["Develop electrical systems and power solutions","Work on renewable energy projects","Design electronic circuits"] },
      { id: "computer_eng", title: "Computer Engineering", description: "Combines software and hardware design for computing systems.", duration: "5 years", careerPaths: ["Computer Engineer", "Embedded Systems Developer"], futureWork: ["Design computer hardware","Develop embedded systems","Integrate software and hardware"] },
      { id: "mechanical", title: "Mechanical Engineering", description: "Design and develop mechanical machines and systems.", duration: "5 years", careerPaths: ["Mechanical Engineer", "Automation Specialist"], futureWork: ["Create mechanical machines and tools","Improve manufacturing processes","Develop automated systems"] },
      { id: "geodetic", title: "Geodetic Engineering", description: "Surveying, mapping, and earth measurement science.", duration: "5 years", careerPaths: ["Geodetic Engineer", "Survey Engineer"], futureWork: ["Conduct land surveys","Develop mapping solutions","Work on GIS projects"] },
      { id: "electronics", title: "Electronics Engineering", description: "Focus on designing electronic circuits and devices.", duration: "5 years", careerPaths: ["Electronics Engineer", "Circuit Designer"], futureWork: ["Develop electronic devices","Design circuits","Work on communication systems"] },
      { id: "environmental", title: "Environmental Engineering", description: "Design solutions for environmental protection and sustainability.", duration: "5 years", careerPaths: ["Environmental Engineer", "Sustainability Specialist"], futureWork: ["Develop sustainable systems","Manage waste and pollution projects","Ensure environmental compliance"] },
      { id: "agri_bio", title: "Agricultural and Biosystems Engineering", description: "Combine agriculture and engineering to improve farming systems.", duration: "5 years", careerPaths: ["Agricultural Engineer", "Biosystems Analyst"], futureWork: ["Improve farming technology","Develop irrigation systems","Optimize food production processes"] },
      { id: "naval", title: "Naval Architecture and Marine Engineering", description: "Design ships, boats, and marine structures.", duration: "5 years", careerPaths: ["Naval Architect", "Marine Engineer"], futureWork: ["Design marine vessels","Develop offshore structures","Ensure safety at sea"] },
    ],
  },
  {
    id: "csis",
    title: "Computer Science and Information Systems",
    courses: [
      { id: "cs", title: "Computer Science", description: "Software development, algorithms, and computing principles.", duration: "4 years", careerPaths: ["Software Developer", "System Analyst"], futureWork: ["Develop software applications","Manage systems","Create IT solutions for businesses"] },
      { id: "data_science", title: "Data Science", description: "Analyze data to extract insights for businesses and research.", duration: "4 years", careerPaths: ["Data Scientist", "Data Analyst"], futureWork: ["Analyze and interpret data","Create predictive models","Develop data-driven solutions"] },
      { id: "tech_comm_mgmt", title: "Technology Communication Management", description: "Manage IT projects and communication systems.", duration: "4 years", careerPaths: ["IT Project Manager", "Communication Specialist"], futureWork: ["Lead IT projects","Manage communication technologies","Develop organizational IT strategies"] },
      { id: "it", title: "Information Technology", description: "Focus on managing IT systems and infrastructure.", duration: "4 years", careerPaths: ["IT Specialist", "Network Administrator"], futureWork: ["Maintain IT systems","Manage networks","Support technical operations"] },
    ],
  },
  {
    id: "tech",
    title: "Technology",
    courses: [
      { id: "agri_tech", title: "Agricultural Technology", description: "Hands-on study of modern agricultural systems.", duration: "4 years", careerPaths: ["Agri-Technologist", "Farm Manager"], futureWork: ["Manage farms","Develop efficient farming systems","Work with agricultural machinery"] },
      { id: "autotronics", title: "Autotronics", description: "Integration of automotive and electronics systems.", duration: "4 years", careerPaths: ["Autotronics Technician", "Automotive Engineer"], futureWork: ["Develop automotive electronics","Work on vehicle automation","Maintain automotive systems"] },
      { id: "electro_mech", title: "Electro-Mechanical Technology", description: "Combining mechanical and electrical systems.", duration: "4 years", careerPaths: ["Electro-Mechanical Technician","Industrial Automation Engineer"], futureWork: ["Maintain machinery","Develop automated systems","Integrate electrical and mechanical solutions"] },
      { id: "electronics", title: "Electronics Technology", description: "Study of electronics and circuits in technical systems.", duration: "4 years", careerPaths: ["Electronics Technician","Circuit Developer"], futureWork: ["Design circuits","Maintain electronic systems","Work on communication technology"] },
      { id: "energy_mgmt", title: "Energy Systems and Management", description: "Managing energy production and efficiency.", duration: "4 years", careerPaths: ["Energy Manager","Power Systems Engineer"], futureWork: ["Develop sustainable energy solutions","Manage energy systems","Work on efficiency projects"] },
      { id: "food_proc", title: "Food Processing and Technology", description: "Processing and preservation of food products.", duration: "4 years", careerPaths: ["Food Technologist","Quality Analyst"], futureWork: ["Develop food processing techniques","Ensure food safety","Improve production efficiency"] },
      { id: "manufacturing", title: "Manufacturing Engineering Technology", description: "Production systems and industrial processes.", duration: "4 years", careerPaths: ["Manufacturing Engineer","Process Engineer"], futureWork: ["Optimize manufacturing processes","Implement automation","Manage industrial systems"] },
    ],
  },
  {
    id: "life",
    title: "Life Sciences",
    courses: [
      { id: "agriculture", title: "Agriculture", description: "Major in Animal Science, Crop Science, Entrepreneurship, Dairy Science, Agricultural Education.", duration: "4 years", careerPaths: ["Agriculturist","Farm Manager"], futureWork: ["Manage farms","Develop sustainable agriculture","Optimize food production"] },
      { id: "agroforestry", title: "Agroforestry", description: "Integrating trees and crops for sustainable land use.", duration: "4 years", careerPaths: ["Agroforestry Specialist","Environmental Planner"], futureWork: ["Plan tree-crop systems","Manage sustainable lands","Improve soil quality"] },
      { id: "horticulture", title: "Horticulture and Management", description: "Cultivation of plants for food, medicine, and decoration.", duration: "4 years", careerPaths: ["Horticulturist","Landscape Manager"], futureWork: ["Develop gardens and farms","Grow crops efficiently","Manage plant production"] },
      { id: "marine_bio", title: "Marine Biology", description: "Study of marine organisms and ecosystems.", duration: "4 years", careerPaths: ["Marine Biologist","Researcher"], futureWork: ["Conduct marine research","Protect marine ecosystems","Analyze marine life"] },
    ],
  },
  {
    id: "natural",
    title: "Natural Sciences",
    courses: [
      { id: "applied_math", title: "Applied Mathematics", description: "Mathematical techniques for real-world problems.", duration: "4 years", careerPaths: ["Mathematician","Data Analyst"], futureWork: ["Model real-world problems","Analyze data","Develop mathematical solutions"] },
      { id: "applied_physics", title: "Applied Physics", description: "Physics applied in technology and engineering.", duration: "4 years", careerPaths: ["Physicist","Research Scientist"], futureWork: ["Conduct experiments","Develop technology solutions","Analyze physical systems"] },
      { id: "chemistry", title: "Chemistry", description: "Study of chemical processes and materials.", duration: "4 years", careerPaths: ["Chemist","Lab Technician"], futureWork: ["Develop materials","Conduct chemical experiments","Ensure safety in chemical processes"] },
      { id: "env_sci", title: "Environmental Science", description: "Study of the environment and sustainability.", duration: "4 years", careerPaths: ["Environmental Scientist","Sustainability Officer"], futureWork: ["Analyze environmental data","Develop conservation plans","Manage sustainability projects"] },
    ],
  },
  {
    id: "social",
    title: "Social Sciences",
    courses: [
      { id: "sec_math", title: "Secondary Education (Math)", description: "Major in Mathematics for teaching.", duration: "4 years", careerPaths: ["Math Teacher","Education Specialist"], futureWork: ["Teach mathematics","Develop educational materials","Support students learning"] },
      { id: "sec_sci", title: "Secondary Education (Science)", description: "Major in Science for teaching.", duration: "4 years", careerPaths: ["Science Teacher","Education Specialist"], futureWork: ["Teach science","Create experiments","Support student learning"] },
      { id: "social_work", title: "Social Work", description: "Support communities and individuals.", duration: "4 years", careerPaths: ["Social Worker","Community Officer"], futureWork: ["Assist communities","Develop social programs","Support vulnerable groups"] },
      { id: "tech_voc", title: "Technical-Vocational Teacher", description: "Teach vocational and technical skills.", duration: "4 years", careerPaths: ["Vocational Instructor","Technical Teacher"], futureWork: ["Teach technical skills","Create curriculum","Support students development"] },
      { id: "tle", title: "Technology and Livelihood Education", description: "Major in Industrial Arts, Home Economics.", duration: "4 years", careerPaths: ["TLE Teacher","Skills Trainer"], futureWork: ["Teach life skills","Manage student projects","Develop practical learning programs"] },
    ],
  },
  {
    id: "art",
    title: "Art and Humanities",
    courses: [
      { id: "architecture", title: "Architecture", description: "Study of design, structures, and human spaces.", duration: "5 years", careerPaths: ["Architect"], futureWork: ["Design buildings and structures","Plan urban spaces","Create architectural drawings"] },
    ],
  },
];

// Modal component (same as before)
function CourseModal({ course, onClose }) {
  if (!course) return null;

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
              <li key={index}><span className="career-dot"></span>{career}</li>
            ))}
          </ul>
        </div>
        <div className="modal-section">
          <h3>🚀 Future Work Aligned With This Course</h3>
          <ul className="future-work-list">
            {course.futureWork.map((work, index) => (
              <li key={index}><span className="checkmark">✓</span>{work}</li>
            ))}
          </ul>
        </div>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Course card component
function CourseCard({ course, onClick }) {
  return (
    <div className="course-card" onClick={() => onClick(course)}>
      <h4>{course.title}</h4>
      <p>{course.description.substring(0, 100)}...</p>
      <span className="view-details">Click for details →</span>
    </div>
  );
}

// Program card component
function ProgramCard({ program, onCourseClick }) {
  return (
    <div className="program-card">
      <h3 className="program-title">{program.title}</h3>
      <div className="program-courses-grid">
        {program.courses.map((course) => (
          <CourseCard key={course.id} course={course} onClick={onCourseClick} />
        ))}
      </div>
    </div>
  );
}

// Main Courses Page
export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setModalOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard">
          <div className="courses-header">
            <h2>Programs & Courses</h2>
            <p>Explore our programs. Click a course card to see full details.</p>
          </div>

          <div className="programs-grid">
            {programsData.map((program) => (
              <ProgramCard key={program.id} program={program} onCourseClick={handleCourseClick} />
            ))}
          </div>
        </main>
      </div>

      {modalOpen && <CourseModal course={selectedCourse} onClose={handleCloseModal} />}
    </div>
  );
}