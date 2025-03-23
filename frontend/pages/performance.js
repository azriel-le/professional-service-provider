import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // For bar chart visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FreelancerPerformance = () => {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [acceptedRequests, setAcceptedRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [freelancerId, setFreelancerId] = useState(null);

  // Fetch the logged-in freelancer's user_id
  const userId = localStorage.getItem('user_id');

  // Fetch freelancer ID
  const fetchFreelancerId = async () => {
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/freelancers/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch freelancer profile');
      }
      const { freelancer_id } = await response.json();
      console.log('Freelancer ID fetched:', freelancer_id);
      setFreelancerId(freelancer_id);
    } catch (error) {
      console.error('Error fetching freelancer ID:', error);
      setError('Failed to fetch freelancer ID. Please try again later.');
    }
  };

  // Fetch freelancer's hire requests and calculate counts
  const fetchHireRequests = async () => {
    if (!freelancerId) {
      setError('Freelancer ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/hire/freelancer/${freelancerId}`);
      const data = await response.json();
      console.log('API Response:', data); // Debugging: Log the API response

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch hire requests');
      }

      // Calculate counts
      const pending = data.filter(request => request.status === 'Pending').length;
      const accepted = data.filter(request => request.status === 'Accepted').length;
      const rejected = data.filter(request => request.status === 'Rejected').length;
      console.log('Pending:', pending, 'Accepted:', accepted, 'Rejected:', rejected); // Debugging: Log the counts

      setPendingRequests(pending);
      setAcceptedRequests(accepted);
      setRejectedRequests(rejected);
    } catch (error) {
      console.error('Error fetching hire requests:', error);
      setError(error.message || 'Failed to fetch hire requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerId();
  }, [userId]);

  useEffect(() => {
    if (freelancerId) {
      fetchHireRequests();
    }
  }, [freelancerId]);

  // Data for the bar chart
  const chartData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Hire Requests',
        data: [pendingRequests, acceptedRequests, rejectedRequests],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each status
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
        text: 'Your Hire Request Status',
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="performance">
      <h1>Status</h1>

      {/* Bar Chart */}
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Display Counts */}
      <div className="counts-container">
        <div className="count-card">
          <h4>Pending Requests</h4>
          <p>{pendingRequests}</p>
        </div>
        <div className="count-card">
          <h4>Accepted Requests</h4>
          <p>{acceptedRequests}</p>
        </div>
        <div className="count-card">
          <h4>Rejected Requests</h4>
          <p>{rejectedRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPerformance;