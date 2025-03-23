import { useState } from "react";
import { useRouter } from "next/router";
//import "../styles/App.css"; // ✅ Keep CSS for styling

const Signup = () => {
  const [role, setRole] = useState(""); // Track selected role
  const [showNotification, setShowNotification] = useState(false); // Track notification visibility
  const router = useRouter(); // ✅ Use Next.js router

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleCreateAccount = () => {
    if (role === "client") {
      router.push("/client-hires"); // ✅ Redirect in Next.js
    } else if (role === "freelancer") {
      router.push("/professionals"); // ✅ Redirect in Next.js
    } else {
      setShowNotification(true); // Show notification if no role is selected
    }
  };

  return (
    <div className="container">
      <h1>Join as a Client or Freelancer</h1>
      <div className="role-selection">
        {/* CLIENT SELECTION */}
        <div
          className={`role-card ${role === "client" ? "active" : ""}`}
          onClick={() => handleRoleChange("client")}
        >
          <div className="icon">&#128188;</div>
          <p>I’m a client, hiring for a work</p>
        </div>

        {/* FREELANCER SELECTION */}
        <div
          className={`role-card ${role === "freelancer" ? "active" : ""}`}
          onClick={() => handleRoleChange("freelancer")}
        >
          <div className="icon">&#128100;</div>
          <p>I’m a freelancer, looking for work</p>
        </div>
      </div>

      {/* CREATE ACCOUNT BUTTON */}
      <button onClick={handleCreateAccount} className="create-account">
        Create Account
      </button>

      {/* NOTIFICATION MESSAGE */}
      {showNotification && (
        <p className="notification" style={{ color: "red", marginTop: "10px" }}>
          Please select a role before proceeding.
        </p>
      )}

      <p className="login">
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default Signup;