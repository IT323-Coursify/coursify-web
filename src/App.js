import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssessmentProvider } from "./context/Assessmentcontext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import Settings from "./pages/Settings";          

function App() {
  return (
    <BrowserRouter basename="/coursify-web">
      <AssessmentProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  );
}

export default App;