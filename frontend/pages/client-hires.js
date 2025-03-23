import { useState } from "react";
import { useRouter } from "next/router";
//import "../styles/App.css"; // ✅ Keep CSS for styling

const ClientHires = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone_number: "", // Add phone_number to the initial state
    country: "Ethiopia",
    receiveEmails: false,
    agreeToTerms: false,
  });

  const [message, setMessage] = useState(""); // To store success/error messages
  const router = useRouter(); // ✅ Use Next.js router

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setMessage("You must agree to the terms and conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName, // Convert to backend format
          last_name: formData.lastName,
          work_email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number, // Include phone_number in the request body
          country: formData.country,
          user_type: "client", // Correct field name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("🎉 Account created successfully!");
        setTimeout(() => {
          router.push("/login"); // ✅ Redirect to login after success
        }, 2000);
      } else {
        // Check if the error message indicates that the user already exists
        if (data.message && data.message.includes("Failed to save user to the database")) {
          setMessage("❌ User already exists. Please use a different email.");
        } else {
          setMessage(data.message || "❌ Failed to create account.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ An error occurred while creating the account.");
    }
  };

  return (
    <div className="shared-form"> {/* Add this wrapper */}
    <form onSubmit={handleSubmit}>
      <h2>Create Your Client Account</h2>

      <div>
        <label>
          First name
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Last name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Work email address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Phone Number
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Country
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="Ethiopia">Ethiopia</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="receiveEmails"
            checked={formData.receiveEmails}
            onChange={handleChange}
          />
          Send me emails with tips on how to find talent that fits my needs.
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
          />
          Yes, I understand and agree to the Upwork Terms of Service, including the User Agreement and Privacy Policy.
        </label>
      </div>
      <button type="submit">Create my account</button>

      {message && <p>{message}</p>} {/* Display success/error message */}
    </form>
    </div>
  );
};

export default ClientHires;