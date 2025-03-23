import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic"; // Import dynamic from Next.js

// Dynamically import the Requests and Performance components
const Requests = dynamic(() => import("./Requests"), { ssr: false });
const Performance = dynamic(() => import("./performance"), { ssr: false });

const FreelancerDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [freelancerName, setFreelancerName] = useState("");
  const [hireRequestsCount, setHireRequestsCount] = useState(0); // State to store the number of hire requests
  const [activeComponent, setActiveComponent] = useState("requests"); // Default to Requests
  const router = useRouter();

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/profile/${user_id}`);
        const data = await response.json();

        if (response.ok) {
          const { firstName, lastName } = data.user;
          setFreelancerName(`${firstName} ${lastName}`);
        } else {
          console.error("Failed to fetch profile data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchFreelancerProfile();
  }, [router]);

  const handleMenuItemClick = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleClickOutside = (event) => {
    if (isMenuOpen && !event.target.closest(".freelancer-dashboard .menu-container")) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="freelancer-dashboard">
      <header className="header">
        <h1>Welcome  {freelancerName}</h1>
      </header>

      <nav className="navigation">
        <div className="menu-container">
          <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>☰</span>
          </button>
          <div className={`menu-dropdown ${isMenuOpen ? "open" : ""}`}>
            <button className="menu-item" onClick={() => handleMenuItemClick("/profile-management")}>
              Profile Management
            </button>
            <button className="menu-item" onClick={() => handleMenuItemClick("/change")}>Password Change</button>
            <button className="menu-item" onClick={() => handleMenuItemClick("/logout")}>Logout</button>
          </div>
        </div>

        <button className="nav-button hire-request-button" onClick={() => setActiveComponent("requests")}>
          Hire Requests{" "}
          <span className="badge" style={{ color: "black" }}>
            {hireRequestsCount}
          </span>
        </button>
        <button className="nav-button performance-button" onClick={() => setActiveComponent("performance")}>
          Performance
        </button>
      </nav>

      <main className="main-content">
        {activeComponent === "requests" && (
          <Requests updateHireRequestsCount={setHireRequestsCount} />
        )}
        {activeComponent === "performance" && <Performance />}
      </main>
    </div>
  );
};

export default FreelancerDashboard;