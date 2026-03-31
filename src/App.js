import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AssessmentProvider } from "./context/Assessmentcontext";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";  
import Courses from "./pages/Courses";
import AdminDashboard from "./pages/AdminDashboard"; // ← NEW

function App() {
  return (
    <BrowserRouter basename="/coursify-web">
      <AssessmentProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  );
}

export default App;