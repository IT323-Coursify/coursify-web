import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "User 1",
    email: "student1@coursify.com",
    gradeLevel: "Grade 12",
    strand: "STEM",
  });

  const [preferences, setPreferences] = useState({
    interestedIn: ["Technology & Coding", "Research & Science"],
    preferredWorkStyle: "I like a mix of both",
    careerPriority: "Continuous learning & growth",
  });

  const [draft, setDraft] = useState({ ...profile });

  const allInterests = [
    "Technology & Coding", "Business & Entrepreneurship",
    "Healthcare & Medicine", "Arts & Design",
    "Teaching & Education", "Engineering",
    "Social Work", "Research & Science",
  ];

  const handleEditToggle = () => {
    if (isEditing) setDraft({ ...profile });
    setIsEditing(!isEditing);
    setSaved(false);
  };

  const handleSave = () => {
    setProfile({ ...draft });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleInterest = (interest) => {
    const current = preferences.interestedIn;
    if (current.includes(interest)) {
      setPreferences({ ...preferences, interestedIn: current.filter((i) => i !== interest) });
    } else {
      setPreferences({ ...preferences, interestedIn: [...current, interest] });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard">

        <div className="profile-header">
          <div>
            <h2>My Profile</h2>
            <p>Manage your personal info and course preferences.</p>
          </div>
          {saved && <div className="save-toast">✓ Profile saved successfully!</div>}
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            <button className="edit-btn" onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>Full Name</label>
              {isEditing ? (
                <input className="profile-input" value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              ) : <span>{profile.name}</span>}
            </div>
            <div className="info-field">
              <label>Email</label>
              {isEditing ? (
                <input className="profile-input" value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              ) : <span>{profile.email}</span>}
            </div>
            <div className="info-field">
              <label>Grade Level</label>
              {isEditing ? (
                <select className="profile-input" value={draft.gradeLevel}
                  onChange={(e) => setDraft({ ...draft, gradeLevel: e.target.value })}>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              ) : <span>{profile.gradeLevel}</span>}
            </div>
            <div className="info-field">
              <label>Academic Strand</label>
              {isEditing ? (
                <select className="profile-input" value={draft.strand}
                  onChange={(e) => setDraft({ ...draft, strand: e.target.value })}>
                  <option>STEM</option>
                  <option>ABM</option>
                  <option>HUMSS</option>
                  <option>TVL</option>
                  <option>GAS</option>
                </select>
              ) : <span>{profile.strand}</span>}
            </div>
          </div>

          {isEditing && (
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          )}
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h3>Course Preferences</h3>
            <p className="card-note">Adjusting these updates your recommendations.</p>
          </div>

          <div className="pref-section">
            <label className="pref-label">Interests</label>
            <div className="options-grid">
              {allInterests.map((interest) => {
                const selected = preferences.interestedIn.includes(interest);
                return (
                  <button key={interest}
                    className={"option-chip" + (selected ? " selected" : "")}
                    onClick={() => toggleInterest(interest)}>
                    {selected && "✓ "}{interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pref-section">
            <label className="pref-label">Preferred Work Style</label>
            <div className="options-list">
              {["I enjoy working alone","I prefer small teams","I love large collaborative groups","I like a mix of both"].map((style) => (
                <button key={style}
                  className={"option-row" + (preferences.preferredWorkStyle === style ? " selected" : "")}
                  onClick={() => setPreferences({ ...preferences, preferredWorkStyle: style })}>
                  <span className="option-radio">{preferences.preferredWorkStyle === style ? "●" : "○"}</span>
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="pref-section">
            <label className="pref-label">Career Priority</label>
            <div className="options-list">
              {["High salary & financial stability","Making a difference in society","Creative freedom & expression","Continuous learning & growth"].map((goal) => (
                <button key={goal}
                  className={"option-row" + (preferences.careerPriority === goal ? " selected" : "")}
                  onClick={() => setPreferences({ ...preferences, careerPriority: goal })}>
                  <span className="option-radio">{preferences.careerPriority === goal ? "●" : "○"}</span>
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <button className="save-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
            Update Preferences
          </button>
        </div>

      </main>
    </div>
  );
}

export default Profile;