import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalChats, setTotalChats] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentCount = async (collectionName, setStateFunction) => {
      try {
        const response = await fetch(`http://localhost:5000/api/count/${collectionName}`);
        const data = await response.json();
        setStateFunction(data.count);
      } catch (error) {
        setError(`Error fetching ${collectionName} count: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Fetch counts for various documents
    fetchDocumentCount("users", setTotalUsers);
    fetchDocumentCount("messages", setTotalMessages);
    fetchDocumentCount("reports", setTotalReports);
    fetchDocumentCount("chats", setTotalChats);
    fetchDocumentCount("announcements", setTotalAnnouncements); // Fetch count for announcements
  }, []);

  useEffect(() => {
    const animateCount = (element, target) => {
      const countInterval = 300; // Interval in milliseconds
      const increment = target / countInterval;
      let currentValue = 0;

      const interval = setInterval(() => {
        currentValue += increment;
        element.textContent = Math.ceil(currentValue);

        if (currentValue >= target) {
          element.textContent = target;
          clearInterval(interval);
        }
      }, 1);
    };

    document.querySelectorAll('.total-count').forEach((element) => {
      const targetValue = parseInt(element.getAttribute('data-target'), 10);
      animateCount(element, targetValue);
    });
  }, [totalUsers, totalMessages, totalChats, totalReports, totalAnnouncements]);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or animation
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  


  return (
    <div className="main_admin">
      <div className="main__container">
        <div className="main__title">
          <div className="main__greeting">
            <h1>DASHBOARD</h1>
            <p>Welcome to your Admin Dashboard</p>
          </div>
        </div>

        <div className="main__cards">
          <div className="card_admin">
            <i className="fa fa-users fa-2x text-lightblue" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Total Users: </p>
              <span className="total-count" data-target={totalUsers}>0</span>
            </div>
          </div>
          
          <div className="card_admin">
            <i className="fas fa-comment fa-2x green" aria-hidden="true"></i>
            <div className="card_inner_admin">
               <p className="text-primary-p">Total Chats:</p>
               <span className="total-count" data-target={totalChats}>0</span>
            </div>
          </div>

          <div className="card_admin">
            <i className="fa fa-comments fa-2x text-red" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Total Messages: </p>
              <span className="total-count" data-target={totalMessages}>0</span>
            </div>
          </div>

          <div className="card_admin">
            <i className="fa fa-ban fa-2x text-red" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Total Reports: </p>
              <span className="total-count" data-target={totalReports}>0</span>
            </div>
          </div>

          {/* New card for Total Announcements */}
          <div className="card_admin">
            <i className="fas fa-bullhorn fa-2x text-green" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Announcements: </p>
              <span className="total-count" data-target={totalAnnouncements}>0</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
