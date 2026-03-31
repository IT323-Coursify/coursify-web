import { NavLink, useNavigate } from "react-router-dom";
import logoText1 from "../assets/logo-text.png";
import { MdDashboard, MdAssignment, MdMenuBook, MdPerson } from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("coursify_user");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logoText1} alt="Coursify" className="logo-text1" />
      </div>

      <nav>
        <NavLink to="/dashboard" className="sidebar-link">
          <MdDashboard className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/assessment" className="sidebar-link">
          <MdAssignment className="sidebar-icon" />
          <span>Assessment</span>
        </NavLink>

        <NavLink to="/courses" className="sidebar-link">
          <MdMenuBook className="sidebar-icon" />
          <span>Courses</span>
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <MdPerson className="sidebar-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Logout at bottom */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-logout-icon">⎋</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;