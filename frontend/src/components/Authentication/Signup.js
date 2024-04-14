import { Button } from "@chakra-ui/button";
import { Box, Tooltip } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement, InputLeftElement} from "@chakra-ui/input";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { Select } from "@chakra-ui/select";
import { useHistory } from "react-router";
import "./style.css";
import logoImage from "./ilchatu_hannah.png";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState();    
  const [studentnumber, setStudentNumber] = useState();
  const currentYear = new Date().getFullYear();
  const startYear = 2020 ; // Adjust this value based on your requirements
  const endYear = currentYear - 4; // Allow for the current year

      const yearOptions = Array.from({ length: currentYear - 2024 + 1 }, (_, index) => 2024 + index);
      const programOptions = [
        'Bachelor of Arts in Communication', 
        'Bachelor of Science in Psychology', 
        'Bachelor of Arts in Psychology',
        'Bachelor of Science in Entrepreneurship', 
        'Bachelor of Science in Tourism Management', 
        'Bachelor of Science in Accountancy',
        'Bachelor of Science in Accounting Information System',
        'Bachelor of Science in Information Technology',
        'Bachelor of Science in Computer Science',
        'Bachelor of Science in Mechanical Engineering', 
        'Bachelor of Secondary Education Major in English',
        'Bachelor of Secondary Education Major in Mathematics',
        'Bachelor of Secondary Education Major in Science',
        'Bachelor of Elementary Education',
        'Diploma in Midwifery'
        
        ]; 

        function isInRange(studentnumber) {
          return (
            studentnumber >= (startYear - 2000) * 100000 &&
            studentnumber <= (endYear - 2000) * 100000 + 99999
          );
        }

  function isValidName(name) {
      const validPattern = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/; // Allows alphabetic characters and spaces in between words
      return validPattern.test(name) && name !== "Deleted User";
  }

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

  const submitHandler = async () => {
    setPicLoading(true);
    if (!isValidName(name)) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(name) || !/\s/.test(name)) {
      console.log("Invalid Name");
      toast({
        title: "Invalid Name",
        description: "Please enter a valid Full Name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    
    if (!email.endsWith("com")) {
      debugger
      console.log("Invalid email");
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Email Address",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

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

    if (!isInRange(studentnumber)) {
      console.log("Invalid Student Number Range");
      toast({
        title: "Invalid Student Number Range",
        description: "Please enter a valid Student Number within the acceptable range",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }


    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);


    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",  
        {
          name,
          email,
          studentnumber,
          password,
          pic,
          selectedProgram,
          selectedYear,
        },
        config
      );
      console.log(data);
      toast({
        title: "We've sent you a verification link to verify your account",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      //localStorage.setItem("userInfo", JSON.stringify(data));
    history.push(`/verify-email/${data.verificationToken}`);
      setPicLoading(false);
  //   history.push("/chats");
  history.push("/");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ilchatu");
      data.append("cloud_name", "ilchatu");
      fetch("https://api.cloudinary.com/v1_1/ilchatu/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  const handleTooltipClick = () => {
    setShowPasswordInfo(!showPasswordInfo);
  };

  return (
    <VStack spacing="5px">
      <div class="container-auth" id="container-auth">
        <div class="form-container sign-up">
          <form>
            <div class="loginContainer">
              <h1 id="loginHeading">Sign Up</h1>
            </div>

            <FormControl id="first-name" isRequired>
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              {/* <FormLabel>Email Address</FormLabel> */}
              <Input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            {/* <FormControl id="studentnumber" isRequired>
              <Input
                type="studentnumber"
                placeholder="Student Number"
                onChange={(e) => setStudentnumber(e.target.value)}
              />
            </FormControl> */}
            
            <FormControl id="password" isRequired>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.8rem"
                    size="sm"
                    onClick={handleClick}
                    className="showhide"
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                {/* Use Tooltip component to display the message */}
                <Tooltip
                  label="Password must contain at least one uppercase letter, one lowercase letter, one symbol, one digit, and be at least 8 characters long."
                  aria-label="password-requirements"
                  isOpen={showPasswordInfo} // Add isOpen prop to control visibility
                >
                  <InputLeftElement cursor="pointer" onClick={handleTooltipClick}>
                    <Box
                      as={InfoOutlineIcon}
                      color="gray.500"
                      marginRight="25"
                      marginTop="4"
                      width="10px"
                      height="13px"
                    />
                  </InputLeftElement>
                </Tooltip>
              </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
              {/* <FormLabel>Confirm Password</FormLabel> */}
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.8rem"
                    size="small"
                    onClick={handleClick}
                    className="showhide"
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>



            <FormControl id="pic">
            <FormLabel fontSize="smaller">Upload a Profile</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FormControl>


            <FormControl id="studentnumber" bg="#eee" isRequired>
              {/* <FormLabel>Student Number</FormLabel> */}
              <Input
                placeholder="Student Number"
                onChange={(e) => setStudentNumber(e.target.value)}
                sx={{
                  padding: '10 px', 
                  fontSize: '0.8 rem',
                }}
              />
            </FormControl>


              <FormControl id="selectedProgram" bg="#eee" isRequired>
                <Select
                  placeholder="Select Program"
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  value={selectedProgram}
                  sx={{
                    padding: '10px', // Adjust padding as needed
                    fontSize: '0.8rem', // Adjust font size as needed
                  }}
                >
                  {programOptions.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl borderRadius = "10px" id="year" style={{ marginTop: 15 }} bg="#eee" isRequired>
                <Select
                  placeholder="Select Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  value={selectedYear}
                  sx={{
                    padding: '10px', // Adjust padding as needed
                    fontSize: '0.8rem', // Adjust font size as needed
                  }}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </FormControl>





            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={picLoading}
            >
              Sign Up
            </Button>
          </form>
        </div>
        <div class="toggle-container-signup">
          <div class="toggle">
            <div class="toggle-panel toggle-right">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "40%",
                  transform: "translateX(-40%)",
                }}
              >
                <Box mb={2}>
                  <img
                    src={logoImage}
                    alt="iLearnU Logo"
                    className="logo"
                    style={{ width: "180px", height: "auto" }}
                  />
                </Box>
              </div>

              <div>
                <h1 style={{ textAlign: "center" }}>Welcome to iLchatU!</h1>
                <p>
                  Sign up with your personal details to Connect with
                  iLchatUsers!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VStack>
  );
};

export default Signup;
