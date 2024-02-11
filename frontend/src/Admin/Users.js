import React, { useState, useEffect } from 'react';
import './Users.css'; // Import the CSS file

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container" style={{ overflowY: 'auto'}}>
      <h2>iLchatUsers</h2>
      <div className="search-container" style={{ textAlign: "center"}}>
        <label htmlFor="search" className='user1'>Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Enter name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center", color: "green" }}>Name</th>
            <th style={{ textAlign: "center", color: "green"}}>Email</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.map(user => (
            <tr key={user._id}>
              <td className='user1'>{user.name}</td>
              <td className='user2'>{user.email}</td>
              {/* Add more table cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
