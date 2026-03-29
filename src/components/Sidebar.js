import { NavLink } from "react-router-dom";
import logoText1 from "../assets/logo-text.png";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logoText1} alt="Coursify" className="logo-text1" />
      </div>

      <nav>
        {/* NavLink automatically applies an 'active' class when the route matches */}
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>
        
        <NavLink to="/assessment" className="sidebar-link">
          Assessment
        </NavLink>
        
        <NavLink to="/courses" className="sidebar-link">
          Courses
        </NavLink>
        
        <NavLink to="/profile" className="sidebar-link">
          Profile
        </NavLink>
        
      </nav>
    </aside>
  );
}

export default Sidebar;