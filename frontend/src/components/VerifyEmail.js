import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(`/api/auth/verify/${token}`);
        console.log(data.message);
        // Optionally, you can redirect the user to a login page or display a success message
      } catch (error) {
        console.error('Error verifying email:', error.message);
        // Handle the error (e.g., display an error message to the user)
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      {/* You can render a loading spinner or a message here while the email is being verified */}
      Verifying email...
    </div>
  );
};

export default VerifyEmail;
