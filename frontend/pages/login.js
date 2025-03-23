import { useState } from "react";
import { useRouter } from "next/router";
//import "../styles/App.css"; // ✅ Keep CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To hold error messages
  const router = useRouter(); // ✅ Use Next.js router

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("🟢 Logging in with:", email, password);

      // Step 1: Authenticate the user
      const loginResponse = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ work_email: email, password }), // ✅ Match backend field names
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { access_token, user_type, user_id } = await loginResponse.json();
      console.log("✅ Login successful. Token:", access_token);
      console.log("✅ User ID:", user_id); // Log user_id for debugging

      // Store token, email, and user_id in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("email", email);
      localStorage.setItem("user_id", user_id);

      // Step 2: Redirect based on user type
      if (user_type === "admin") {
        router.push("/admin-dashboard"); // Redirect admin to the admin dashboard
      } else if (user_type === "client") {
        router.push("/client-dashboard");
      } else if (user_type === "freelancer") {
        // Step 3: Check if the freelancer profile exists
        const profileResponse = await fetch(
          `http://localhost:5000/freelancers/profile/${user_id}`
        );

        console.log("Profile Response Status:", profileResponse.status); // Log response status

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json(); // Log error details
          console.error("Profile Error Data:", errorData);
          throw new Error("Failed to fetch freelancer profile");
        }

        const { profile_completed } = await profileResponse.json();
        console.log("✅ Profile Completed:", profile_completed); // Log profile status

        // Step 4: Redirect based on profile completion status
        if (profile_completed) {
          router.push("/freelancer-dashboard"); // Redirect to dashboard if profile is complete
        } else {
          router.push("/freelancer-profile-form"); // Redirect to form if profile is incomplete
        }
      } else {
        throw new Error("Unknown user type");
      }
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      setErrorMessage(error.message); // Set the error message state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {/* Display error message below the login button */}
        {errorMessage && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;