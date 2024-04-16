  import { Button } from "@chakra-ui/button";
  import { Box, Tooltip,Text, Flex } from "@chakra-ui/react";
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
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
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


      if (newPassword !== confirmpassword) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(name, email, newPassword, pic);


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
            password: newPassword,
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
<Tooltip label="Password must be at least 8 characters long and include alphanumeric, uppercase, lowercase characters, and at least one symbol" placement="top">
  <FormControl>
    <InputGroup size="md">
      <Input
        type={showNewPassword ? "text" : "password"}
        id="newpassword"
        placeholder="Password"
        value={newPassword}
        onChange={handleNewPasswordChange}
        required
      />
      <InputRightElement width="3rem">

        <Flex align="center">
          <Text ml= "5" mt="5px" height={7} fontSize="sm" width="100px" 
          color={passwordStrengthColor(passwordStrength)} fontWeight="bold">
            {passwordStrengthLabel(passwordStrength)}
          </Text>

          <Button h="1.8rem" width={12} size="xs" onClick={() => setShowNewPassword(!showNewPassword)} ml={-12}>
            {showNewPassword ? "Hide" : "Show"}
          </Button>
        </Flex>
      </InputRightElement>
    </InputGroup>
  </FormControl>
</Tooltip>


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
