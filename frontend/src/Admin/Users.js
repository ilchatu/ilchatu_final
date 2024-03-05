import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input } from '@chakra-ui/react';
import './Users.css'; // Import the CSS file

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://ilchatu-a26s.onrender.com/api/users');
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

  const handleDelete = async () => {
    try {
      await fetch(`https://ilchatu-a26s.onrender.com/api/users/${userIdToDelete}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(user => user._id !== userIdToDelete));
      setShowConfirmation(false);
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openConfirmationModal = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
  };

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
            <th style={{ textAlign: "center", color: "green"}}>Actions</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.map(user => (
            <tr key={user._id}>
              <td className='user1'>{user.name}</td>
              <td className='user2'>{user.email}</td>
              <td className='user3'> <button onClick={() => openConfirmationModal(user._id)}>Delete</button></td>
              {/* Add more table cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
          <AlertDialog
        isOpen={showConfirmation}
        leastDestructiveRef={undefined}
        onClose={closeConfirmationModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDelete} colorScheme="red" ml={3}>
                Yes
              </Button>
              <Button onClick={closeConfirmationModal} ml={3}>
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isSuccessOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsSuccessOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>
            <AlertDialogBody>
              User deleted successfully!
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Users;
