import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import socketIOClient from "socket.io-client";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalChats, setTotalChats] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Load online users from localStorage on component mount
    const savedOnlineUsers = localStorage.getItem("onlineUsers");
    if (savedOnlineUsers) {
      setOnlineUsers(JSON.parse(savedOnlineUsers));
    }

    const socket = socketIOClient("https://ilchatu.com");
    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
    });

    socket.on("getOnlineUsers", (users) => {
      console.log("Received online users:", users);
      setOnlineUsers(users);
      // Save online users to localStorage
      localStorage.setItem("onlineUsers", JSON.stringify(users));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchDocumentCount = async (collectionName, setStateFunction) => {
      try {
        const response = await fetch(`https://ilchatu-a26s.onrender.com/api/count/${collectionName}`);
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
    fetchDocumentCount("announcements", setTotalAnnouncements);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
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
              <span className="total-count">{totalUsers}</span>
            </div>
          </div>

          <div className="card_admin">
            <i className="fas fa-users fa-2x text-green" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Active Users: </p>
              <span className="total-count">{onlineUsers.filter(user => user.userId !== null).length}</span>
            </div>
          </div>

          {/* 
          <div className="card_admin">
            <i className="fas fa-comment fa-2x green" aria-hidden="true"></i>
            <div className="card_inner_admin">
               <p className="text-primary-p">Total Chats:</p>
               <span className="total-count"> {totalChats} </span>
            </div>
          </div>

          <div className="card_admin">
            <i className="fa fa-comments fa-2x text-red" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Total Messages: </p>
              <span className="total-count"> {totalMessages} </span>
            </div>
          </div> */}

          <div className="card_admin">
            <i className="fa fa-ban fa-2x text-red" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Total Reports: </p>
              <span className="total-count">{totalReports}</span>
            </div>
          </div>

          <div className="card_admin">
            <i className="fas fa-bullhorn fa-2x text-green" aria-hidden="true"></i>
            <div className="card_inner_admin">
              <p className="text-primary-p">Announcements: </p>
              <span className="total-count">{totalAnnouncements}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
