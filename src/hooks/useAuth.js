import { useState } from "react";
import { useNavigate } from "react-router-dom";

const admins = [
  { email: "admin@coursify.edu", password: "admin123", name: "Administrator" },
];

const users = [
  { email: "student1@coursify.com", password: "123456", name: "User 1" },
];

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Check admin credentials first
    const foundAdmin = admins.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (foundAdmin) {
      sessionStorage.setItem("coursify_user", foundAdmin.name);
      sessionStorage.setItem("coursify_role", "admin");
      setMessage(`Welcome, ${foundAdmin.name}!`);
      navigate("/admin/dashboard");
      return;
    }

    // Fall through to student check
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      sessionStorage.setItem("coursify_user", foundUser.name);
      sessionStorage.setItem("coursify_role", "student");
      setMessage(`Welcome, ${foundUser.name}! Login successful.`);
      navigate("/dashboard");
    } else {
      setMessage("Invalid email or password.");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    message,
    showPassword, setShowPassword,
    handleSubmit,
  };
}