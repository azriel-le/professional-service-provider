import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bar, Pie } from 'react-chartjs-2'; // For visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Notification Component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const backgroundColor = type === 'success' ? '#28a745' : '#dc3545'; // Green for success, red for error

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: backgroundColor,
        color: 'white',
        borderRadius: '5px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        &times;
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showHireRequests, setShowHireRequests] = useState(false);
  const [hireRequests, setHireRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPlatformAnalytics, setShowPlatformAnalytics] = useState(false); // Toggle platform analytics
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/admin/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError('Network error, please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch all hire requests
  useEffect(() => {
    const fetchHireRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/hire');
        const data = await response.json();
        if (response.ok) {
          setHireRequests(data);
        } else {
          throw new Error('Failed to fetch hire requests');
        }
      } catch (error) {
        console.error('Error fetching hire requests:', error);
        setNotification({ message: 'Failed to fetch hire requests', type: 'error' });
      }
    };

    if (showHireRequests || showPlatformAnalytics) {
      fetchHireRequests();
    }
  }, [showHireRequests, showPlatformAnalytics]);

  // Handle account suspension/activation
  const handleUpdateStatus = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/users/admin/user/${userId}/status?status=${status}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setNotification({ message: 'User status updated successfully', type: 'success' });
        setTimeout(() => router.reload(), 1500); // Refresh the page after 1.5 seconds
      } else {
        setNotification({ message: 'Failed to update user status', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setNotification({ message: 'Error updating user status', type: 'error' });
    }
  };

  // Handle account deletion
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/admin/user/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setNotification({ message: 'User deleted successfully', type: 'success' });
        setTimeout(() => router.reload(), 1500); // Refresh the page after 1.5 seconds
      } else {
        const data = await response.json();
        setNotification({ message: data.message || 'Failed to delete user', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setNotification({ message: 'Error deleting user', type: 'error' });
    }
  };

  // Fetch user details (client)
  const handleViewDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/admin/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedUser(data); // Set client details
        setIsModalOpen(true);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setNotification({ message: 'Failed to fetch user details', type: 'error' });
    }
  };

  // Fetch freelancer details
  const handleViewFreelancerDetails = async (userId) => {
    try {
      console.log(`Fetching freelancer details for user ID: ${userId}`); // Debugging
  
      // Step 1: Fetch all freelancers with user details
      const allFreelancersResponse = await fetch('http://localhost:5000/freelancers/admin/freelancers');
      const allFreelancers = await allFreelancersResponse.json();
  
      if (!allFreelancersResponse.ok) {
        throw new Error('Failed to fetch freelancers');
      }
  
      // Step 2: Find the freelancer with the matching user_id
      const freelancer = allFreelancers.find((f) => f.user.id === userId);
  
      if (!freelancer) {
        setNotification({ message: 'Freelancer profile not found for this user', type: 'error' });
        return;
      }
  
      console.log('Freelancer found:', freelancer); // Debugging
  
      // Step 3: Fetch detailed freelancer data using the freelancer ID
      const freelancerDetailsResponse = await fetch(`http://localhost:5000/freelancers/admin/freelancer/${freelancer.id}`);
      
      console.log('Response status:', freelancerDetailsResponse.status); // Debugging
      if (!freelancerDetailsResponse.ok) {
        throw new Error(`Failed to fetch freelancer details: ${freelancerDetailsResponse.statusText}`);
      }
  
      const data = await freelancerDetailsResponse.json();
      console.log('Freelancer details:', data); // Debugging
  
      if (!data) {
        setNotification({ message: 'Freelancer data is empty', type: 'error' });
        return;
      }
  
      // Ensure the user data is included in the response
      if (!data.user) {
        setNotification({ message: 'User details not found in freelancer data', type: 'error' });
        return;
      }
  
      setSelectedFreelancer(data);
      setIsFreelancerModalOpen(true);
    } catch (error) {
      console.error('Error fetching freelancer details:', error.message, error.stack);
      setNotification({ message: 'Failed to fetch freelancer details', type: 'error' });
    }
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const closeFreelancerModal = () => {
    setIsFreelancerModalOpen(false);
    setSelectedFreelancer(null);
  };

  // Filter hire requests by status
  const filteredHireRequests = filterStatus === 'all'
    ? hireRequests
    : hireRequests.filter(request => request.status === filterStatus);

  // Calculate platform statistics
  const totalClients = users.filter(user => user.user_type === 'client').length;
  const totalFreelancers = users.filter(user => user.user_type === 'freelancer').length;
  const totalHireRequests = hireRequests.length;

  const pendingHireRequests = hireRequests.filter(request => request.status === 'Pending').length;
  const acceptedHireRequests = hireRequests.filter(request => request.status === 'Accepted').length;
  const rejectedHireRequests = hireRequests.filter(request => request.status === 'Rejected').length;

  const activeUsers = users.filter(user => user.status === 'active').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  const deletedUsers = users.filter(user => user.status === 'deleted').length;

  // Data for the hire request status chart
  const hireRequestChartData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Hire Requests',
        data: [pendingHireRequests, acceptedHireRequests, rejectedHireRequests],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Data for the user status chart
  const userStatusChartData = {
    labels: ['Active', 'Suspended', 'Deleted'],
    datasets: [
      {
        label: 'Users',
        data: [activeUsers, suspendedUsers, deletedUsers],
        backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Status Distribution',
      },
    },
  };

  // Get most active clients (sorted by number of hire requests)
  const mostActiveClients = users
    .filter(user => user.user_type === 'client')
    .map(client => ({
      ...client,
      hireRequestCount: hireRequests.filter(request => request.user_id === client.id).length,
    }))
    .sort((a, b) => b.hireRequestCount - a.hireRequestCount)
    .slice(0, 5); // Top 5 most active clients

  // Get most active freelancers (sorted by number of accepted hire requests)
  const mostActiveFreelancers = users
    .filter(user => user.user_type === 'freelancer')
    .map(freelancer => ({
      ...freelancer,
      acceptedHireRequestCount: hireRequests.filter(request => request.freelancer_id === freelancer.id && request.status === 'Accepted').length,
    }))
    .sort((a, b) => b.acceptedHireRequestCount - a.acceptedHireRequestCount)
    .slice(0, 5); // Top 5 most active freelancers

  // Get inactive users (users with no activity in the last 30 days)
  const inactiveUsers = users.filter(user => {
    const lastActivityDate = new Date(user.last_activity); // Assuming `last_activity` is a field in the user object
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActivityDate < thirtyDaysAgo;
  });

  // Update hire request status
  const handleUpdateHireStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/hire/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setNotification({ message: 'Hire request status updated successfully', type: 'success' });
        setTimeout(() => router.reload(), 1500); // Refresh the page after 1.5 seconds
      } else {
        setNotification({ message: 'Failed to update hire request status', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating hire request status:', error);
      setNotification({ message: 'Error updating hire request status', type: 'error' });
    }
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {/* Manage Users Button */}
      <button
        onClick={() => setShowManageUsers(!showManageUsers)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          marginRight: '10px',
        }}
      >
        {showManageUsers ? 'Hide Manage Users' : 'Manage Users'}
      </button>

      {/* Hire Requests Button */}
      <button
        onClick={() => setShowHireRequests(!showHireRequests)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          marginRight: '10px',
        }}
      >
        {showHireRequests ? 'Hide Hire Requests' : 'Manage Hire Requests'}
      </button>

      {/* Platform Analytics Button */}
      <button
        onClick={() => setShowPlatformAnalytics(!showPlatformAnalytics)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showPlatformAnalytics ? 'Hide Platform Analytics' : 'View Platform Analytics'}
      </button>

      {/* User Management Section */}
      {showManageUsers && (
        <>
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.work_email}</td>
                  <td>{user.user_type}</td>
                  <td>{user.status}</td>
                  <td>
                    <button onClick={() => handleUpdateStatus(user.id, 'suspended')}>Suspend</button>
                    <button onClick={() => handleUpdateStatus(user.id, 'active')}>Activate</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    <button onClick={() => user.user_type === 'freelancer' ? handleViewFreelancerDetails(user.id) : handleViewDetails(user.id)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Hire Request Management Section */}
      {showHireRequests && (
        <>
          <h2>Hire Requests</h2>

          {/* Filter by Status */}
          <div style={{ marginBottom: '20px' }}>
            <label>Filter by Status: </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Hire Requests Table */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Freelancer</th>
                <th>Project Details</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHireRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.user?.first_name} {request.user?.last_name}</td>
                  <td>{request.freelancer?.title}</td>
                  <td>{request.projectDetails}</td>
                  <td>{request.status}</td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleUpdateHireStatus(request.id, 'Accepted')}>Accept</button>
                    <button onClick={() => handleUpdateHireStatus(request.id, 'Rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Platform Analytics Section */}
      {showPlatformAnalytics && (
        <>
          <h2>Platform Analytics</h2>

          {/* Statistics Cards */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', flex: 1 }}>
              <h3>Total Clients</h3>
              <p>{totalClients}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', flex: 1 }}>
              <h3>Total Freelancers</h3>
              <p>{totalFreelancers}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', flex: 1 }}>
              <h3>Total Hire Requests</h3>
              <p>{totalHireRequests}</p>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
            <div style={{ flex: 1 }}>
              <h3>Hire Request Status</h3>
              <Bar data={hireRequestChartData} options={chartOptions} />
            </div>
            <div style={{ flex: 1 }}>
              <h3>User Status</h3>
              <Pie data={userStatusChartData} options={chartOptions} />
            </div>
          </div>

          {/* User Activity Reports */}
          <h3>User Activity Reports</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h4>Most Active Clients</h4>
              <ul>
                {mostActiveClients.map(client => (
                  <li key={client.id}>
                    {client.first_name} {client.last_name} - {client.hireRequestCount} requests
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4>Most Active Freelancers</h4>
              <ul>
                {mostActiveFreelancers.map(freelancer => (
                  <li key={freelancer.id}>
                    {freelancer.first_name} {freelancer.last_name} - {freelancer.acceptedHireRequestCount} accepted requests
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4>Inactive Users</h4>
              <ul>
                {inactiveUsers.map(user => (
                  <li key={user.id}>
                    {user.first_name} {user.last_name} - Last active: {new Date(user.last_activity).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Modals for User and Freelancer Details */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
        <div className="modal">
          <h2>User Details</h2>
          <p>First Name: {selectedUser.first_name}</p>
          <p>Last Name: {selectedUser.last_name}</p>
          <p>Email: {selectedUser.work_email}</p>
          <p>Phone Number: {selectedUser.phone_number}</p>
          <p>Country: {selectedUser.country}</p>
          <button onClick={closeModal}>Close</button>
        </div>
        </div>
      )}

{isFreelancerModalOpen && selectedFreelancer && selectedFreelancer.user && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Freelancer Details</h2>
      <p>
        Profile Picture:{' '}
        <img
          src={`http://localhost:5000${selectedFreelancer.profilePicture}`}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      </p>
      <p>First Name: {selectedFreelancer.user.first_name}</p>
      <p>Last Name: {selectedFreelancer.user.last_name}</p>
      <p>Email: {selectedFreelancer.user.work_email}</p>
      <p>Phone Number: {selectedFreelancer.user.phone_number}</p>
      <p>Country: {selectedFreelancer.user.country}</p>
      <p>Title: {selectedFreelancer.title}</p>
      <p>Skills: {selectedFreelancer.skills}</p>
      <p>Experience Level: {selectedFreelancer.experienceLevel}</p>
      <p>Hourly Rate: {selectedFreelancer.hourlyRate}</p>
      <p>Bio: {selectedFreelancer.bio}</p>
      <p>Portfolio: {selectedFreelancer.portfolio}</p>
      <p>Availability: {selectedFreelancer.availability}</p>
      <p>Languages: {selectedFreelancer.languages}</p>
      <p>Location: {selectedFreelancer.location}</p>
      <p>Rating: {selectedFreelancer.rating}⭐</p>
      <button onClick={closeFreelancerModal}>Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;