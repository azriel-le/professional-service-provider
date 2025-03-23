import React, { useState } from 'react';
import { useRouter } from 'next/router';

const FreelancerProfileForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    experienceLevel: '',
    hourlyRate: '',
    bio: '',
    portfolio: '',
    availability: '',
    languages: '',
    location: '',
    profilePicture: null,
    rating: 0,
  });

  const [message, setMessage] = useState("");
  const [profilePreview, setProfilePreview] = useState(null); // For displaying the uploaded image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'hourlyRate' || key === 'rating') {
        formDataToSend.append(key, Number(formData[key]));
      } else if (key === 'profilePicture' && formData[key]) {
        formDataToSend.append(key, formData[key], formData[key].name);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    const user_id = localStorage.getItem('user_id');
    formDataToSend.append('user_id', user_id);

    try {
      const response = await fetch('http://localhost:5000/freelancers/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server Error:', result);
        throw new Error(result.message || 'Failed to submit profile');
      }

      console.log('Profile created successfully:', result);
      setMessage("Profile created successfully!");

      setTimeout(() => {
        router.push('/freelancer-dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error submitting profile:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="freelancer-profile-form">
      <h2>Freelancer Profile Setup</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Upload */}
        <div className="profile-picture-container">
          <div className="profile-picture-wrapper">
            <div className="profile-picture-circle">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="profile-picture-preview"
                />
              ) : (
                <div className="profile-picture-placeholder"></div>
              )}
              <label className="upload-button">
                <span>+</span>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden-input"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Rest of the form fields */}
        {/* Title */}
        <div className="flex flex-col">
          <label>Professional Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Full Stack Developer"
            onChange={handleChange}
            required
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g. JavaScript, React, Node.js"
            onChange={handleChange}
            required
          />
        </div>

        {/* Experience Level */}
        <div className="flex flex-col">
          <label>Experience Level</label>
          <select
            name="experienceLevel"
            onChange={handleChange}
            required
          >
            <option value="">Select Experience Level</option>
            <option value="Entry">Entry</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Hourly Rate */}
        <div className="flex flex-col">
          <label>Hourly Rate ($)</label>
          <input
            type="number"
            name="hourlyRate"
            placeholder="e.g. 50"
            onChange={handleChange}
            required
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label>About Me</label>
          <textarea
            name="bio"
            placeholder="Write a short introduction about yourself..."
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Portfolio */}
        <div className="flex flex-col">
          <label>Portfolio Link</label>
          <input
            type="text"
            name="portfolio"
            placeholder="e.g. https://myportfolio.com"
            onChange={handleChange}
          />
        </div>

        {/* Availability */}
        <div className="flex flex-col">
          <label>Availability</label>
          <select
            name="availability"
            onChange={handleChange}
            required
          >
            <option value="">Select Availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>

        {/* Languages */}
        <div className="flex flex-col">
          <label>Languages Spoken</label>
          <input
            type="text"
            name="languages"
            placeholder="e.g. English, Spanish"
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. New York, USA"
            onChange={handleChange}
            required
          />
        </div>

        {/* Rating System */}
        <div className="flex flex-col items-center space-y-2">
          <span className="font-bold">Rate Your Expertise: {formData.rating} ⭐</span>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                className={`rating-button ${formData.rating >= num ? 'active' : ''}`}
                onClick={() => handleRatingChange(num)}
              >
                <span>⭐</span>
                <span>{num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">
          Submit Profile
        </button>

        {/* Success or Error Message */}
        {message && (
          <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default FreelancerProfileForm;