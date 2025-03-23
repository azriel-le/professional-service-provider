import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation

const ClientDashboard = ({ freelancers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [projectDetails, setProjectDetails] = useState("");
  const [isHiring, setIsHiring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null); // State for notification

  const router = useRouter(); // Initialize useRouter

  // Function to handle menu item clicks
  const handleMenuItemClick = (path) => {
    router.push(path); // Navigate to the specified path
    setIsMenuOpen(false); // Close the dropdown menu
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user_id = localStorage.getItem("user_id");
      if (user_id) {
        setCurrentUser({ id: user_id });
      } else {
        alert("You must be logged in to access this page.");
        window.location.href = "/login";
      }
    }
  }, []);

  const handleHireRequest = async (freelancerId) => {
    if (!currentUser || !currentUser.id) {
      setNotification("You must be logged in to send a hire request.");
      return;
    }

    if (!projectDetails.trim()) {
      setNotification("Please provide project details.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          freelancerId,
          projectDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send hire request");
      }

      setNotification("Hire request sent successfully!");
      setProjectDetails("");
      setIsHiring(false);
      setSelectedFreelancer(null);
    } catch (error) {
      console.error("Error sending hire request:", error);
      setNotification("Failed to send hire request.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFreelancers = freelancers
    .filter((freelancer) => {
      const fullName = `${freelancer.fullName}`;
      return (
        freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className={`client-dashboard ${isMenuOpen ? "blur-background" : ""}`}>
      <h1 className="dashboard-title">Your Go-To Experts, Ready to Work</h1>

      {/* Search Bar and Menu */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by title or name..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ marginLeft: "auto" }}
        >
          <span>☰</span>
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            {/* Profile Management Button */}
            <button
              className="menu-item"
              onClick={() => handleMenuItemClick("/client-profile-management")}
            >
              Profile Management
            </button>

            {/* Password Change Button */}
            <button
              className="menu-item"
              onClick={() => handleMenuItemClick("/password-change")}
            >
              Password Change
            </button>

            {/* Logout Button */}
            <button
              className="menu-item"
              onClick={() => handleMenuItemClick("/logout")}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Freelancer Grid */}
      <div className="freelancer-grid">
        {filteredFreelancers.map((freelancer) => (
          <div key={freelancer.id} className="freelancer-card">
            <div className="profile-picture">
              <img
                src={
                  freelancer.profilePicture
                    ? `http://localhost:5000${freelancer.profilePicture}`
                    : "/default-profile.png"
                }
                alt="Profile"
              />
            </div>

            <div className="freelancer-info">
              <h2>{freelancer.fullName}</h2>
              <p>{freelancer.title}</p>
              <p className="rating">Rating: {freelancer.rating} ⭐</p>
            </div>

            <button
              className="see-details-button"
              onClick={() =>
                setSelectedFreelancer(
                  selectedFreelancer === freelancer ? null : freelancer
                )
              }
            >
              {selectedFreelancer === freelancer ? "Hide Details" : "See Details"}
            </button>

            {selectedFreelancer === freelancer && (
              <div className="freelancer-details">
                <p>
                  <strong>Title:</strong> {freelancer.title}
                </p>
                <p>
                  <strong>Skills:</strong> {freelancer.skills}
                </p>
                <p>
                  <strong>Experience Level:</strong> {freelancer.experienceLevel}
                </p>
                <p>
                  <strong>Hourly Rate:</strong> ${freelancer.hourlyRate}
                </p>
                <p>
                  <strong>Bio:</strong> {freelancer.bio}
                </p>
                <p>
                  <strong>Portfolio:</strong> {freelancer.portfolio}
                </p>
                <p>
                  <strong>Availability:</strong> {freelancer.availability}
                </p>
                <p>
                  <strong>Languages:</strong> {freelancer.languages}
                </p>
                <p>
                  <strong>Location:</strong> {freelancer.location}
                </p>
                <p>
                  <strong>Rating:</strong> {freelancer.rating} ⭐
                </p>

                {!isHiring ? (
                  <button
                    className="hire-button"
                    onClick={() => setIsHiring(true)}
                  >
                    Hire
                  </button>
                ) : (
                  <div>
                    <textarea
                      placeholder="Enter project details..."
                      className="project-details-input"
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                    />

                    <div className="button-group">
                      <button
                        className={`hire-button ${isLoading ? "loading-button" : ""}`}
                        onClick={() => handleHireRequest(freelancer.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Submit"}
                      </button>
                      <button
                        className="undo-button"
                        onClick={() => setIsHiring(false)}
                      >
                        Undo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div className="overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Notification Container */}
      {notification && (
        <div className="notification-container">
          <p>{notification}</p>
          <button onClick={() => setNotification(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await fetch("http://localhost:5000/freelancers/all");

    if (!response.ok) {
      throw new Error("Failed to fetch freelancers");
    }

    const data = await response.json();

    console.log("API Response Received in Frontend:", data);

    return {
      props: {
        freelancers: data.map((freelancer) => ({
          id: freelancer.id,
          title: freelancer.title,
          profilePicture: freelancer.profilePicture,
          fullName: freelancer.fullName,
          rating: freelancer.rating,
          skills: freelancer.skills,
          experienceLevel: freelancer.experienceLevel,
          hourlyRate: freelancer.hourlyRate,
          bio: freelancer.bio,
          portfolio: freelancer.portfolio,
          availability: freelancer.availability,
          languages: freelancer.languages,
          location: freelancer.location,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return {
      props: {
        freelancers: [],
      },
    };
  }
}

export default ClientDashboard;