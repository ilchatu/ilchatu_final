const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  console.log("r", req.body);
  const { name, email, /*studentnumber,*/ password, pic } = req.body;

  if (!name || !email || /*!studentnumber ||*/ !password) {
    res.status(400);
    throw new Error("Please enter all the Fields");
  }

  const userExists = await User.findOne({ email }); //To implement one email, one user

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    // studentnumber,
    password: encryptedPassword,
    pic,
    isVerified: false,
    verificationToken,
    address,
    mobileNumber,
    occupation,
    Bio,
  });

  if (user) {
    // Send verification email
    console.log("12");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "ilchatu2023@gmail.com",
        pass: "wxydpjtxjkvcoikl",
      },
    });

    const mailOptions = {
      from: "ilchatu2023@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Welcome to iLchatU! Click the following link to verify your email: https://ilcha.onrender.com/api/auth/verify/${verificationToken}/${user.id}`,
      //   text: `Welcome to iLchatU! Click the following link to verify your email: https://i-l-chatu.onrender.com/api/auth/verify/${verificationToken}/${user.id}`,
    };
    console.log("1212");
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("12");
      if (error) {
        console.log("asdfghj");
        // Rollback registration if email fails to send
        User.deleteOne({ _id: user._id })
          .then(() => {
            console.log("asdfghjklfghjkl");
            console.log("Registration rolled back successfully,,,");
          })
          .catch((err) => {
            console.error("Error rolling back registration:", err);
          });
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          // studentnumber: user.studentnumber,
          pic: user.pic,
          token: generateToken(user._id),
          verificationToken: user.verificationToken,
          message: "Verification Link sent Successfully",
        });
      }
    });
  } else {
    res.status(400);
    throw new Error("User not Found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, /*studentnumber,*/ password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email /*studentnumber*/ });
  console.log(user);
  var IsVerified = user.isVerified;
  console.log(user);
  console.log(await user.matchPassword(password));

  if (user && IsVerified && (await user.matchPassword(password))) {
    console.log(generateToken(user._id));
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // studentnumber: user.studentnumber,
      pic: user.pic,
      mobileNumber: user.mobileNumber,
      address: user.address,
      occupation: user.occupation,
      Bio: user.Bio,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Please check your credentials or Verify your Account");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
const updateUserProfile = asyncHandler(async (req, res) => 

{
  const { 
    UserId,
    pic, 
    name, 
    mobileNumber,
    address,
    occupation,
    Bio } = req.body;

  if (!pic) {
    res.status(400);
    throw new Error("Please provide a profile picture");
  }
  console.log('Received pic:', pic);


  try {
    const user = await User.findById(UserId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }


    user.name = name;
    user.mobileNumber = mobileNumber;
    user.address = address;
    user.occupation = occupation;
    user.Bio = Bio;
    user.pic = pic;

    // Save the updated user
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      name: user.name,
      mobileNumber: user.mobileNumber,
      address: user.address,
      occupation: user.occupation,
      Bio: user.Bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = { registerUser, authUser, allUsers, updateUserProfile };
