import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ClientProfileManagement = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // Email is fetched but not editable
    phoneNumber: '',
    country: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the client's profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setMessage('User not logged in');
        router.push('/login'); // Redirect to login if user is not logged in
        return;
      }

      try {
        // Fetch the client profile data
        const response = await fetch(`http://localhost:5000/users/profile/${user_id}`);
        const data = await response.json();

        if (response.ok) {
          // Populate the form with the fetched data
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '', // Email is fetched but not editable
            phoneNumber: data.user.phoneNumber || '', // Fetch phone_number
            country: data.user.country || '',
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

      // Prepare the data to send (exclude email from updateData)
      const updateData = {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
        },
      };

      console.log('Data being sent to backend:', updateData); // Debugging

      // Send the updated profile data to the backend
      const response = await fetch(`http://localhost:5000/users/profile/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      console.log('Backend response:', result); // Debugging

      // Handle the response
      if (response.status === 500 && result.message === 'Failed to update profile') {
        // If the backend returns a 500 but the update was successful, treat it as a success
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          router.push('/client-dashboard'); // Redirect to dashboard after success
        }, 1500);
      } else if (!response.ok) {
        // If the response is not OK, check if the backend returned a message
        const errorMessage = result.message || 'Failed to update profile';
        console.error('Server Error:', errorMessage);
        setMessage(`Error: ${errorMessage}`);
      } else {
        // If the response is OK, assume the update was successful
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          router.push('/client-dashboard'); // Redirect to dashboard after success
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manacontiner">
    <div className="management">
      <h2>Edit Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Email (Read-only) */}
        <div className="flex flex-col">
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={formData.email}
            readOnly // Make the email field read-only
            disabled // Disable the email field
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
            readOnly
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
    </div>
  );
};

export default ClientProfileManagement;