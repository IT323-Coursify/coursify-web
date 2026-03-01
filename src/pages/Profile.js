import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: sessionStorage.getItem("coursify_user") || "User 1",
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
      <div className="dashboard-main">
        <Header />
        <main className="dashboard">

          <div className="profile-header">
            <div>
              <h2>My Profile</h2>
              <p>Manage your personal info and course preferences.</p>
            </div>
            {saved && (
              <div className="save-toast" role="status">
                ✓ Profile saved successfully!
              </div>
            )}
          </div>

          {/* Personal Info */}
          <section className="profile-card" aria-label="Personal information">
            <div className="card-header">
              <h3>Personal Information</h3>
              <button type="button" className="edit-btn" onClick={handleEditToggle}>
                {isEditing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>

            <div className="info-grid">
              <div className="info-field">
                <label htmlFor="profile-name">Full Name</label>
                {isEditing ? (
                  <input
                    id="profile-name"
                    className="profile-input"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                ) : <span>{profile.name}</span>}
              </div>

              <div className="info-field">
                <label htmlFor="profile-email">Email</label>
                {isEditing ? (
                  <input
                    id="profile-email"
                    className="profile-input"
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  />
                ) : <span>{profile.email}</span>}
              </div>

              <div className="info-field">
                <label htmlFor="profile-grade">Grade Level</label>
                {isEditing ? (
                  <select
                    id="profile-grade"
                    className="profile-input"
                    value={draft.gradeLevel}
                    onChange={(e) => setDraft({ ...draft, gradeLevel: e.target.value })}
                  >
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                ) : <span>{profile.gradeLevel}</span>}
              </div>

              <div className="info-field">
                <label htmlFor="profile-strand">Academic Strand</label>
                {isEditing ? (
                  <select
                    id="profile-strand"
                    className="profile-input"
                    value={draft.strand}
                    onChange={(e) => setDraft({ ...draft, strand: e.target.value })}
                  >
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
              <button type="button" className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </section>

          {/* Preferences */}
          <section className="profile-card" aria-label="Course preferences">
            <div className="card-header">
              <h3>Course Preferences</h3>
              <p className="card-note">Adjusting these updates your recommendations.</p>
            </div>

            <div className="pref-section">
              <p className="pref-label">Interests</p>
              <div className="options-grid" role="group" aria-label="Select your interests">
                {allInterests.map((interest) => {
                  const selected = preferences.interestedIn.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      className={"option-chip" + (selected ? " selected" : "")}
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest)}
                    >
                      {selected && "✓ "}{interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pref-section">
              <p className="pref-label">Preferred Work Style</p>
              <div className="options-list" role="group" aria-label="Select work style">
                {["I enjoy working alone", "I prefer small teams", "I love large collaborative groups", "I like a mix of both"].map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={"option-row" + (preferences.preferredWorkStyle === style ? " selected" : "")}
                    aria-pressed={preferences.preferredWorkStyle === style}
                    onClick={() => setPreferences({ ...preferences, preferredWorkStyle: style })}
                  >
                    <span className="option-radio" aria-hidden="true">
                      {preferences.preferredWorkStyle === style ? "●" : "○"}
                    </span>
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="pref-section">
              <p className="pref-label">Career Priority</p>
              <div className="options-list" role="group" aria-label="Select career priority">
                {["High salary & financial stability", "Making a difference in society", "Creative freedom & expression", "Continuous learning & growth"].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={"option-row" + (preferences.careerPriority === goal ? " selected" : "")}
                    aria-pressed={preferences.careerPriority === goal}
                    onClick={() => setPreferences({ ...preferences, careerPriority: goal })}
                  >
                    <span className="option-radio" aria-hidden="true">
                      {preferences.careerPriority === goal ? "●" : "○"}
                    </span>
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="save-btn"
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            >
              Update Preferences
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Profile;