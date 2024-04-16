import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Text,
  Box,
  FormControl,
  Tooltip,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import "./ResetPassword.css";

function ResetNewPassword() {
  const { param1: userId, param2: token } = useParams();
  const history = useHistory();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  useEffect(() => {
    console.log("Reset Password Component loaded.");
  }, []);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrengthColor = (strength) => {
    switch (strength) {
      case 0: return 'transparent';
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellow';
      case 4: return 'lightgreen';
      case 5: return 'green';
      default: return 'transparent';
    }
  };

  const passwordStrengthLabel = (strength) => {
    switch (strength) {
      case 0: return '';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Moderate';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };


  const handleNewPasswordChange = (event) => {
    const { value } = event.target;
    setNewPassword(value);
    setPasswordStrength(getPasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Make sure both passwords are the same.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (passwordStrength < 3) {
      toast({
        title: "Weak password",
        description: "Please use a stronger password.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      await axios.post(
        "/api/auth/SetNewpassword",
        { userId, 
          token, 
          password : newPassword, 
         },
        config
      );

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated. Please log in with your new password.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      history.push("/");
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Failed to update password",
        description: "An unexpected error occurred. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div className="container2">
      <h6>Create New Password</h6>
      <h3>Your New Password should be different from your old password</h3>
      <form onSubmit={handleSubmit} className="form1">
      <Tooltip label="Password must be at least 8 characters long and include alphanumeric, uppercase, lowercase characters, and at least one symbol" placement="top">
        <FormControl>
          <InputGroup bg="#eee" size="sm" width={"100%"} style={{ marginBottom: 15 }}>
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newpassword"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <InputRightElement width="8rem">
            <Text ml={4} fontSize="sm" width="150px" color={passwordStrengthColor(passwordStrength)}>
                      {passwordStrengthLabel(passwordStrength)}
                  </Text>
              <Button h="1.75rem" size="sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? "Hide" : "Show"}
              </Button>

            </InputRightElement>
          </InputGroup>
        </FormControl>
        </Tooltip>
        <FormControl>
          <InputGroup bg="#eee">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button mt={4} type="submit" colorScheme="blue">Set New Password</Button>
      </form>
    </div>
  );
}

export default ResetNewPassword;
