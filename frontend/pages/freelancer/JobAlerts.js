import React, { useEffect, useState } from 'react';

const JobAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/jobs/subscribe');

    eventSource.onmessage = (event) => {
      const newJob = JSON.parse(event.data);

      // Automatically add the new job to alerts (no skill filtering here)
      setAlerts((prevAlerts) => [...prevAlerts, newJob]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          🚀 New Job Alert: {alert.title} - {alert.description}
        </div>
      ))}
    </div>
  );
};

export default JobAlert;