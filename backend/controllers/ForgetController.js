const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = resetToken;
    await user.save();

    // const link = `${process.env.BASE_URL}ResetNewPassword/${user._id}/${resetToken}`;
    const link = `https://ilchatu-a26s.onrender.com/ResetNewPassword/${user._id}/${resetToken}`;

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
      text: `Click the following link to reset your password: ${link}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const Newpassword = async (req, res) => {
  //console.log("ResetNewPassword1");
  console.log(req.body);
  const { userId, newPassword } = req.body;

  if ( !userId || !newPassword) {
    res.status(400);
    throw new Error("Please enter all the Fields");
  }
  try {
    // console.log("ResetNewPassword2");
    const user = await User.findOne({
      _id: userId,
    }).exec();
    console.log(user);
    //console.log("ResetNewPassword3");
    if (!user) {
      return res.status(404).send("User not found");
    }
    //console.log("ResetNewPassword4");
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    console.log(encryptedPassword);
    //console.log("ResetNewPassword5");
    user.password = encryptedPassword;
    console.log(user);
    await user.save();
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};






const NewpasswordSet = async (req, res) => {
  //console.log("ResetNewPassword1");
  console.log(req.body);
  const { userId, token, password } = req.body;

  if (!token || !userId || !password) {
    res.status(400);
    throw new Error("Please enter all the Fields");
  }
  try {
    // console.log("ResetNewPassword2");
    const user = await User.findOne({
      _id: userId,
      verificationToken: token,
    }).exec();
    console.log(user);
    //console.log("ResetNewPassword3");
    if (!user) {
      return res.status(404).send("User not found or invalid token");
    }
    //console.log("ResetNewPassword4");
    user.verificationToken = undefined;
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    //console.log("ResetNewPassword5");
    user.password = encryptedPassword;
    console.log(user);
    await user.save();
    //console.log("ResetNewPassword5");
    console.log(user);
    res.status(200).send("Password reset link sent Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const matchPassword = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { password, UserId } = req.body;
  const user = await User.findById(UserId);
  console.log(await user.matchPassword(password));
 
  
  if (user &&(await user.matchPassword(password))){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // studentnumber: user.studentnumber,
      pic: user.pic,
      token: generateToken(user._id), 
    });
  }
  else {
    res.status(401);
    throw new Error("Please check your password");
}
});

module.exports = { ForgotPassword, Newpassword, NewpasswordSet, matchPassword };
