import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose} className="notification-close">
        &times;
      </button>
    </div>
  );
};

const Requests = ({ updateHireRequestsCount }) => {
  const [hireRequests, setHireRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [freelancerId, setFreelancerId] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification

  const userId = localStorage.getItem("user_id");

  const fetchFreelancerId = async () => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/freelancers/profile/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch freelancer profile");
      }
      const { freelancer_id } = await response.json();
      console.log("Freelancer ID fetched:", freelancer_id);
      setFreelancerId(freelancer_id);
    } catch (error) {
      console.error("Error fetching freelancer ID:", error);
      setError("Failed to fetch freelancer ID. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHireRequests = async () => {
    if (!freelancerId) {
      setError("Freelancer ID not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/hire/freelancer/${freelancerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch hire requests");
      }
      const data = await response.json();
      console.log("Fetched hire requests:", data);
      setHireRequests(data);

      if (updateHireRequestsCount) {
        updateHireRequestsCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching hire requests:", error);
      setError("Failed to fetch hire requests. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/hire/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Accepted" }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept request");
      }

      setNotification("Request accepted!"); // Set notification message
      fetchHireRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      setNotification("Failed to accept request."); // Set notification message
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/hire/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Rejected" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject request");
      }

      setNotification("Request rejected!"); // Set notification message
      fetchHireRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      setNotification("Failed to reject request."); // Set notification message
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

  return (
    <div className="requests-wrapper">
      <div className="requests-container">
        <h1 className="requests-title">Hire Requests</h1>

        {isLoading && <p className="text-center">Loading hire requests...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-4">
          {hireRequests.length > 0 ? (
            hireRequests.map((request) => (
              <div key={request.id} className="request-item">
                <h2 className="client-name">
                  Client: {request.user ? `${request.user.first_name} ${request.user.last_name}` : `ID: ${request.userId}`}
                </h2>
                <p className="project-details">{request.projectDetails}</p>
                <p className="status">Status: {request.status}</p>

                {request.status === "Pending" && (
                  <div className="mt-2">
                    <button
                      className="button button-accept"
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="button button-reject"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">No hire requests found.</p>
          )}
        </div>
      </div>

      {/* Notification component */}
      <Notification
        message={notification}
        onClose={() => setNotification(null)} // Clear notification on close
      />
    </div>
  );
};

export default Requests;