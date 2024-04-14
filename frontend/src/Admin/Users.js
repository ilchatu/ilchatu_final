import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input } from '@chakra-ui/react';
import './Users.css'; // Import the CSS file
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [userIdToSetAdmin, setUserIdToSetAdmin] = useState(null);
  const [showSetAdminConfirmation, setShowSetAdminConfirmation] = useState(false);
  const [isSetAdminSuccessOpen, setIsSetAdminSuccessOpen] = useState(false);
  const [userIdToRemoveAdmin, setUserIdToRemoveAdmin] = useState(null);
  const [showRemoveAdminConfirmation, setShowRemoveAdminConfirmation] = useState(false);
  const [isRemoveAdminSuccessOpen, setIsRemoveAdminSuccessOpen] = useState(false);

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSoftDelete = async (userId) => {
    const deleteUUID = uuidv4();
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
  
    try {
      const response = await axios.post(
        "/api/user/softdelete",
        {
          userId,
          deleteUUID
        },
        config
      );
  
      if (response.status === 200) {
        console.log('Soft deletion successful, UUID:', deleteUUID);
        // Update users state to remove the deleted user
        setUsers(users.filter(user => user._id !== userId));
        setIsSuccessOpen(true); // Open the success message
        setShowConfirmation(false); // Close the confirmation modal
      } else {
        // Handle unsuccessful response
        console.error('Soft deletion failed:', response.statusText);
        // You can display an error message to the user or handle the error in another way
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error soft deleting user:', error);
    }
  };  
   
  const handleSetAdmin = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${userIdToSetAdmin}/set-admin`, {
        method: 'PUT',
      });
      console.log('Admin status set successfully');
      setShowSetAdminConfirmation(false);
      setIsSetAdminSuccessOpen(true);
      setTimeout(() => {
        setIsSetAdminSuccessOpen(false);
        setUsers(users.map(user => {
          if (user._id === userIdToSetAdmin) {
            return { ...user, isAdmin: true };
          }
          return user;
        }));
      }, 3000);
    } catch (error) {
      console.error('Error setting admin:', error);
    }
  };
  
  const handleRemoveAdmin = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${userIdToRemoveAdmin}/remove-admin`, {
        method: 'PUT',
      });
      console.log('Admin status removed successfully');
      setShowRemoveAdminConfirmation(false);
      setIsRemoveAdminSuccessOpen(true);
      setTimeout(() => {
        setIsRemoveAdminSuccessOpen(false);
        setUsers(users.map(user => {
          if (user._id === userIdToRemoveAdmin) {
            return { ...user, isAdmin: false };
          }
          return user;
        }));
      }, 3000);
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };
  

  const openConfirmationModal = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmation(true);
  };

  const openSetAdminModal = (userId) => {
    setUserIdToSetAdmin(userId);
    setShowSetAdminConfirmation(true);
  };

  const openRemoveAdminModal = (userId) => {
    setUserIdToRemoveAdmin(userId);
    setShowRemoveAdminConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="user-list-container" style={{ overflowY: 'auto'}}>
      <h2>iLchatUsers</h2>
      <div className="search-container" style={{ textAlign: "center"}}>
        <label htmlFor="search" className='user1'>Search:</label>
        <Input
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
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.map(user => (
            <tr key={user._id}>
              <td className='user1'>{user.name}</td>
              <td className='user2'>{user.email}</td>
              <td className='user3'>
                <div className="buttonGroup">
                  <button className="deleteButton" onClick={() => openConfirmationModal(user._id)}>Delete</button>
                  {user.isAdmin ? (
                    <button className="removeAdminButton" onClick={() => openRemoveAdminModal(user._id)}>Remove Admin</button>
                  ) : (
                    <button className="adminButton" onClick={() => openSetAdminModal(user._id)}>Set Admin</button>
                  )}
                </div>
              </td>
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
            <Button onClick={() => handleSoftDelete(userIdToDelete)} colorScheme="red" ml={3}>
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
        isOpen={showSetAdminConfirmation}
        leastDestructiveRef={undefined}
        onClose={() => setShowSetAdminConfirmation(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Set Admin
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to set this user as admin?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleSetAdmin} colorScheme="green" ml={3}>
                Yes
              </Button>
              <Button onClick={() => setShowSetAdminConfirmation(false)} ml={3}>
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={showRemoveAdminConfirmation}
        leastDestructiveRef={undefined}
        onClose={() => setShowRemoveAdminConfirmation(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Remove Admin
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove admin status from this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleRemoveAdmin} colorScheme="red" ml={3}>
                Yes
              </Button>
              <Button onClick={() => setShowRemoveAdminConfirmation(false)} ml={3}>
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
      <AlertDialog
        isOpen={isSetAdminSuccessOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsSetAdminSuccessOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>
            <AlertDialogBody>
              User set as admin successfully!
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isRemoveAdminSuccessOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsRemoveAdminSuccessOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>
            <AlertDialogBody>
              Admin status removed successfully!
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Users;
