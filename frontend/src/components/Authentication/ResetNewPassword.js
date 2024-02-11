import "./ResetPassword.css";
import React, { useState, useEffect  } from 'react';
import { Box, FormControl } from "@chakra-ui/react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement, InputLeftElement} from "@chakra-ui/input";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
//import "./style.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ResetNewPassword(){
  const history = useHistory();
  const toast = useToast();
  const [picLoading, setPicLoading] = useState(false);
    const { param1, param2 } = useParams();

    function isSequentialPassword(password) {
      for (let i = 0; i < password.length - 2; i++) {
        const charCode1 = password.charCodeAt(i);
        const charCode2 = password.charCodeAt(i + 1);
        const charCode3 = password.charCodeAt(i + 2);
    
        // Check for sequential characters (you can customize this logic)
        if (charCode1 === charCode2 - 1 && charCode2 === charCode3 - 1) {
          return true;
        }
        if (charCode1 === charCode2 + 1 && charCode2 === charCode3 + 1) {
          return true;
        }
      }
    
      return false;
    }

    useEffect(() => {
    
        console.log("Resetpassword");
       });
       
       const [show, setShow] = useState(false);
       const handleClick = () => setShow(!show);
       const [userId, setUserId] = useState(param1); // Assuming param1 is the UserId
       const [token, setToken] = useState(param2); // Assuming param2 is the Token
       const [password,SetNewPassword]=useState('');
       const [ConfirmPassword,SetConfirmPassWord]=useState('');
       const [showPasswordInfo, setShowPasswordInfo] = useState(false);
     
       const handleSubmit = async (e) => {
        debugger;
        console.log(userId);
        console.log(token);
         e.preventDefault();
     
         if (password.length < 8) {
          toast({
           title: "Password is too short (min 8 characters)",
            status: "warning",
           duration: 5000,
           isClosable: true,
            position: "bottom",
    
          });
          setPicLoading(false);
          return;
        }
    
        if (isSequentialPassword(password)) {
          toast({
            title: "Password must not contain sequential characters",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
          return;
        }
    
    
            if (!/[A-Z]/.test(password)) {
          toast({
            title: "Password must contain atleast one Uppercase Letter",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
    
          });
          setPicLoading(false);
          return;
        }
    
        if (!/[a-z]/.test(password)) {
          toast({
            title: "Password must contain atleast one Lowercase Letter",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
    
          });
          setPicLoading(false);
          return;
        }
    
        if (!/[0-9]/.test(password)) {
          toast({
            title: "Password must contain atleast one number",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
    
          });
          setPicLoading(false);
          return;
        }
    
    if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) {
          toast({
            title: "Password must contain atleast one Special Character",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
    
          });
          setPicLoading(false);
          return;
        }
    
    
    
        if (password !== ConfirmPassword) {
          toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }

         try {
           const config = {
             headers: {
               "Content-type": "application/json",
             },
           };
           const { data } = await axios.post(
             "api/auth/SetNewpassword",
             {userId,token,password},
             config
           );
           console.log(data);
           toast({
            title: "Your Password is Successfully Updated",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
           history.push("/");
         } catch (error) {
           console.error('Error fetching email token:', error);
         }
       };


    return (
        <>  
         <div className="container2">
    <h6>Create New Password</h6>
    <h3>Your New Password should be different from your old password</h3>
    <form onSubmit={handleSubmit} className="form1">
      <div >
        <FormControl>
        <label htmlFor="NewPassword"></label>
        <InputGroup bg="#eee" size="sm" width={"100%"} style={{marginBottom: 15}}>
        <input
          type={show? "text" : "password"}
          id="newpassword"
          //width={}
          placeholder="New Password"
          value={password}
          onChange={(e) => SetNewPassword(e.target.value)}
          required
        />
          <InputRightElement width="3rem">
                  <Button
                    h="1rem" size="sm"
                    onClick={handleClick} width="45px"
                    colorScheme="green"
                    height="35px"
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>

                <InputLeftElement>
              <Box 
              as={InfoOutlineIcon} 
              color="gray.500"
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
              cursor="pointer"
              marginRight="58"
              marginTop="4"
              width="13px"  
              height="13px" 
/>

          </InputLeftElement>

</InputGroup>

{showPasswordInfo && (
          <Box mt={2} fontSize="x-small" color="gray.500">
            Password must contain at least one uppercase letter, one lowercase letter,
            one symbol, one digit, and be at least 8 characters long.
          </Box>
        )}
</FormControl>
<FormControl>
<InputGroup bg="#eee" size="sm" width={"100%"} >
        <label htmlFor="ConfirmPassword"></label>
        <input 
        type={show? "text" : "password"}
          id="confirmpassword"
          
          placeholder="Confirm Password"
          value={ConfirmPassword}
          onChange={(e) => SetConfirmPassWord(e.target.value)}
          required
        />
<InputRightElement width="3rem">
                  <Button
                   h="1rem" size="sm"
                   onClick={handleClick} 
                   colorScheme="green"
                   
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
</InputGroup>
</FormControl>
      </div>
      <Button type="submit" 
      colorScheme="green"
      >
      Set New Password 
      </Button>
    </form>
  </div>
        </>
    )

   
}

export default ResetNewPassword;