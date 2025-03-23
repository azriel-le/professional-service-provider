import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter

const Professionals = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone_number: '', // Add phone_number to the initial state
    country: 'Ethiopia',
    receiveEmails: false,
    agreeToTerms: false,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!formData.agreeToTerms) {
      setMessage("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          work_email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number, // Include phone_number in the request body
          country: formData.country,
          user_type: "freelancer",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("🎉 Account created successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone_number: '', // Reset phone_number
          country: 'Ethiopia',
          receiveEmails: false,
          agreeToTerms: false,
        });
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login'); // Redirect to login page
        }, 2000);
      } else {
        // Check if the error message indicates that the user already exists
        if (data.message && data.message.includes("Failed to save user to the database")) {
          setMessage("❌ User already exists. Please use a different email.");
        } else {
          setMessage(data.message || "❌ Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Network error, please try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="shared-form"> {/* Add this wrapper */}
      <h2>Create Your Freelancer Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Work email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="Ethiopia">Ethiopia</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="receiveEmails"
              checked={formData.receiveEmails}
              onChange={handleChange}
            />
            Send me emails with tips on how to find clients and grow my business.
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
            Yes, I understand and agree to the Terms of Service.
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create my account'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default Professionals;