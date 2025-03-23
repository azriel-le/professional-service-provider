import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ProfileManagement = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Password is kept in state but hidden in the UI
    phoneNumber: '', // Added phone_number field
    country: '',
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

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the user's profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setMessage('User not logged in');
        router.push('/login'); // Redirect to login if user is not logged in
        return;
      }

      try {
        // Fetch the combined profile data
        const response = await fetch(`http://localhost:5000/users/profile/${user_id}`);
        const data = await response.json();

        if (response.ok) {
          // Populate the form with the fetched data
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            password: data.user.password || '', // Password is kept but hidden
            phoneNumber: data.user.phoneNumber || '', // Fetch phone_number
            country: data.user.country || '',
            title: data.freelancer?.title || '',
            skills: data.freelancer?.skills || '',
            experienceLevel: data.freelancer?.experienceLevel || '',
            hourlyRate: data.freelancer?.hourlyRate || '',
            bio: data.freelancer?.bio || '',
            portfolio: data.freelancer?.portfolio || '',
            availability: data.freelancer?.availability || '',
            languages: data.freelancer?.languages || '',
            location: data.freelancer?.location || '',
            profilePicture: data.freelancer?.profilePicture || null,
            rating: data.freelancer?.rating || 0,
          });
        } else {
          setMessage(data.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setMessage('Network error, please try again.');
      }
    };

    fetchProfileData();
  }, [router]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes (profile picture)
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  // Handle rating changes
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setMessage('User not logged in');
        return;
      }

      // Prepare the data to send
      const updateData = {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          work_email: formData.email,
          password: formData.password, // Password is sent to the backend
          phone_number: formData.phoneNumber, // Include phone_number
          country: formData.country,
        },
        freelancer: {
          title: formData.title,
          skills: formData.skills,
          experienceLevel: formData.experienceLevel,
          hourlyRate: Number(formData.hourlyRate),
          bio: formData.bio,
          portfolio: formData.portfolio,
          availability: formData.availability,
          languages: formData.languages,
          location: formData.location,
          profilePicture: formData.profilePicture,
          rating: Number(formData.rating),
        },
      };

      // Send the updated profile data to the backend
      const response = await fetch(`http://localhost:5000/users/profile/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server Error:', result);
        throw new Error(result.message || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        router.push('/freelancer-dashboard'); // Redirect to dashboard after success
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilemanagement max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <label className="font-semibold mb-2">Profile Picture</label>
          <div className="relative w-24 h-24">
            {formData.profilePicture ? (
              <img
                src={
                  typeof formData.profilePicture === 'string'
                    ? `http://localhost:5000${formData.profilePicture}` // Use backend URL for saved images
                    : URL.createObjectURL(formData.profilePicture) // Use object URL for new files
                }
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full cursor-pointer">
              +
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* First Name */}
        <div className="flex flex-col">
          <label className="font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            className="w-full p-2 border rounded"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="w-full p-2 border rounded"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email (Disabled) */}
        <div className="flex flex-col">
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded bg-gray-100"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="font-semibold">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            className="w-full p-2 border rounded"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Country */}
        <div className="flex flex-col">
          <label className="font-semibold">Country</label>
          <input
            type="text"
            name="country"
            className="w-full p-2 border rounded"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        {/* Professional Title */}
        <div className="flex flex-col">
          <label className="font-semibold">Professional Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="font-semibold">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            className="w-full p-2 border rounded"
            value={formData.skills}
            onChange={handleChange}
            required
          />
        </div>

        {/* Experience Level */}
        <div className="flex flex-col">
          <label className="font-semibold">Experience Level</label>
          <select
            name="experienceLevel"
            className="w-full p-2 border rounded"
            value={formData.experienceLevel}
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
          <label className="font-semibold">Hourly Rate ($)</label>
          <input
            type="number"
            name="hourlyRate"
            className="w-full p-2 border rounded"
            value={formData.hourlyRate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label className="font-semibold">About Me</label>
          <textarea
            name="bio"
            className="w-full p-2 border rounded"
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Portfolio Link */}
        <div className="flex flex-col">
          <label className="font-semibold">Portfolio Link</label>
          <input
            type="text"
            name="portfolio"
            className="w-full p-2 border rounded"
            value={formData.portfolio}
            onChange={handleChange}
          />
        </div>

        {/* Availability */}
        <div className="flex flex-col">
          <label className="font-semibold">Availability</label>
          <select
            name="availability"
            className="w-full p-2 border rounded"
            value={formData.availability}
            onChange={handleChange}
            required
          >
            <option value="">Select Availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>

        {/* Languages Spoken */}
        <div className="flex flex-col">
          <label className="font-semibold">Languages Spoken</label>
          <input
            type="text"
            name="languages"
            className="w-full p-2 border rounded"
            value={formData.languages}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="font-semibold">Location</label>
          <input
            type="text"
            name="location"
            className="w-full p-2 border rounded"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Rating System */}
        <div className="flex flex-col items-center space-y-2">
          <span className="font-bold">Rate Your Expertise: {formData.rating} ⭐</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                className={`p-2 text-lg font-bold border rounded flex items-center space-x-1 ${
                  formData.rating >= num ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-black'
                }`}
                onClick={() => handleRatingChange(num)}
              >
                <span>⭐</span>
                <span>{num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Updating Profile...' : 'Update Profile'}
        </button>

        {/* Success or Error Message */}
        {message && (
          <p className={`mt-3 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500 flex items-center justify-center'}`}>
            {message}
            {message === "Profile updated successfully!" && (
              <span className="ml-2">✅</span>
            )}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProfileManagement;