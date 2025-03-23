import React, { useState } from 'react';

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    skillsRequired: '',
    budget: '',
    paymentMethod: '',
    projectDuration: '',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('user_id'); // Retrieve user ID
    if (!userId) {
      setMessage('❌ User not logged in. Please log in to post a job.');
      return;
    }

    const jobData = {
      title: formData.jobTitle, // ✅ Matches DTO field names
      description: formData.jobDescription,
      skills: formData.skillsRequired.split(','), // ✅ Convert string to array
      budget: Number(formData.budget), // ✅ Convert to number
      paymentMethod: formData.paymentMethod,
      projectDuration: formData.projectDuration,
      user_id: Number(userId), // ✅ Attach the user ID
    };

    console.log('📤 Sending job data:', jobData); // Debugging log

    try {
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Job posting failed');
      }

      const data = await response.json();
      setMessage('✅ Job posted successfully!');
      console.log('Response:', data);
    } catch (error) {
      console.error('⚠️ Error posting job:', error.message);
      setMessage('❌ Job posting failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jobTitle">Job Title:</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="skillsRequired">Skills Required (comma separated):</label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bankTransfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label htmlFor="projectDuration">Project Duration:</label>
          <select
            id="projectDuration"
            name="projectDuration"
            value={formData.projectDuration}
            onChange={handleChange}
            required
          >
            <option value="">Select duration</option>
            <option value="shortTerm">Short-term</option>
            <option value="longTerm">Long-term</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <button type="submit">Submit Job Posting</button>
        {message && <p>{message}</p>} {/* ✅ Message moved below the submit button */}
      </form>
    </div>
  );
};

export default JobPostingForm;
