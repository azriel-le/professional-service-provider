import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Change = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setMessage('User not logged in');
        setLoading(false);
        return;
      }

      // Send the password update request
      const response = await fetch(`http://localhost:5000/users/change-password/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      // Handle server errors
      if (!response.ok) {
        // If the server returns a specific error message, display it
        if (result.message) {
          throw new Error(result.message);
        } else {
          throw new Error('Failed to update password');
        }
      }

      // If successful, show success message and redirect
      setMessage('Password updated successfully!');
      setTimeout(() => {
        router.push('/freelancer-dashboard'); // Redirect to dashboard after success
      }, 1500);
    } catch (error) {
      console.error('Error updating password:', error);
      // Display the error message to the user
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paswword">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="flex flex-col">
          <label className="font-semibold">Current Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col">
          <label className="font-semibold">New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col">
          <label className="font-semibold">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>

        {/* Success or Error Message */}
        {message && (
          <p className={`mt-3 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Change;