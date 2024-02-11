import "./ForgetPassword.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';
import { Spinner } from '@chakra-ui/react';

function ForgetPassword() {
  const history = useHistory();
  const toast = useToast();
  const [loading, setLoading] = useState(false); // New loading state
  useEffect(() => {
    console.log('forgetpassword');
  }, []);

  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post('api/auth/forget-password', { email }, config);
  
      toast({
        title: 'Password reset link sent Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
  
      history.push('/');
    } catch (error) {
      console.error('Error fetching email token:', error);
  
      if (error.response && error.response.status === 404) {
        toast({
          title: 'Error',
          description: 'User not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container1">
      <h2>Forgot Password</h2>
      <h4>Enter your email and we'll send you a link to reset your password.</h4>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            icon="&#9993;"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Spinner size="sm" /> : <span className="icon">&#9993; Send Reset Email</span>}
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
