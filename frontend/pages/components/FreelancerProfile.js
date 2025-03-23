// freelancer-profile/[id].js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const FreelancerProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchFreelancer = async () => {
        try {
          const response = await fetch(`http://localhost:5000/freelancers/profile/${id}`);
          const data = await response.json();
          setFreelancer(data);
        } catch (error) {
          console.error('Error fetching freelancer profile:', error);
        }
      };

      fetchFreelancer();
    }
  }, [id]);

  if (!freelancer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Freelancer Profile</h2>

      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src={`http://localhost:5000${freelancer.profilePicture}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Freelancer Info */}
        <div>
          <h3 className="font-bold text-xl">{freelancer.title}</h3>
          <p className="text-sm text-gray-600">{freelancer.firstName} {freelancer.lastName}</p>
          <p className="text-sm text-gray-600">Rating: {freelancer.rating} ⭐</p>
        </div>
      </div>

      {/* Additional Freelancer Details */}
      <div className="mt-6 space-y-4">
        <p><strong>Skills:</strong> {freelancer.skills}</p>
        <p><strong>Experience Level:</strong> {freelancer.experienceLevel}</p>
        <p><strong>Hourly Rate:</strong> ${freelancer.hourlyRate}</p>
        <p><strong>Bio:</strong> {freelancer.bio}</p>
        <p><strong>Portfolio:</strong> <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">{freelancer.portfolio}</a></p>
        <p><strong>Availability:</strong> {freelancer.availability}</p>
        <p><strong>Languages:</strong> {freelancer.languages}</p>
        <p><strong>Location:</strong> {freelancer.location}</p>
      </div>
    </div>
  );
};

export default FreelancerProfile;