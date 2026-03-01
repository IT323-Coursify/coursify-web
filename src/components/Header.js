import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("coursify_user") || "Student";

  const handleLogout = () => {
    sessionStorage.removeItem("coursify_user");
    navigate("/");
  };

  return (
    <header className="app-header">
      <span className="header-greeting">Hi, {userName}! 👋</span>
      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;