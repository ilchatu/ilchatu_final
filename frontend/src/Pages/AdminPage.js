import React, { useState } from 'react';
import Dashboard from '../Admin/Dashboard';
// import AdminManagement from '../Admin/AdminManagement';
import SpamsManagement from '../Admin/SpamsManagement';
import Announcements from '../Admin/Announcements';
import Users from '../Admin/Users';
import Concerns from '../Admin/Concerns';

import './AdminPage.css';
import { useHistory } from 'react-router-dom';

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');

  const history = useHistory();

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    setIsSidebarOpen(false); // Close the sidebar after selecting a component
    if (component === 'Chats') {
    history.push('/chats'); // Redirect to the chats page
  }
};
  

  const handleSidebarIconClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
  };
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };


  const handleLogout = () => {
    localStorage.removeItem('userInfo'); 
    
    history.push('/');
    console.log('Logout clicked');
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: '🏠' },
    // { name: 'Admin Management', icon: '⚙️' },
    { name: 'Reports', icon: '📑' },
    { name: 'Announcements', icon: '📢' },
    {name: 'Concerns', icon: '💭'},
    { name: 'Users', icon: '👥' },
    {name: 'Chats', icon: '💬'},
    
    
  ];

  return (
    <div className="admin-page">
      <div className="sidebar-icon" onClick={handleSidebarIconClick}>
        ☰
      </div>

      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>iLchatU</h1>
            <button className="close-button ${isSidebarOpen ? 'hidden' :" onClick={handleSidebarClose} style={{ fontSize: '30px', fontWeight: 'bold' }}>
            ☰ 
            </button>
          </div>
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item.name}
                onClick={() => handleComponentChange(item.name)}
                className={selectedComponent === item.name ? 'selected' : ''}
              >
                <span role="img" aria-label={item.name}>
                  {item.icon}
                </span>
                {item.name}
              </li>
            ))}
          </ul>
          {/* Logout button at the bottom */}
          <ul style={{ marginTop: '70%', textAlign: 'center'}}>
            <li onClick={handleLogout} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              <span role="img" aria-label="Logout">
                
              </span>
              Logout
            </li>
          </ul>
        </div>
      )}

      <div className="main-content">
        {/* Content remains the same */}
        {selectedComponent === 'Dashboard' && <Dashboard />}
        {/* {selectedComponent === 'Admin Management' && <AdminManagement />} */}
        {selectedComponent === 'Reports' && <SpamsManagement />}
        {selectedComponent === 'Announcements' && <Announcements />}
        {selectedComponent === 'Users' && <Users />}
        {selectedComponent === 'Concerns' && <Concerns />}
      </div>
    </div>
  );
};

export default AdminPage;
