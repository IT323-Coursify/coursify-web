import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Settings() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard">
        <div className="dashboard-header">
          <h2>Settings</h2>
          <p>This page is coming soon.</p>
        </div>
      </main>
    </div>
  );
}

export default Settings;