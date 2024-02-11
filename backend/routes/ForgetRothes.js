const express = require('express');
const router = express.Router();


const { ForgotPassword, Newpassword, NewpasswordSet, matchPassword} = require("../controllers/ForgetController");

router.post('/forget-password', ForgotPassword);
router.post('/matchPassword', matchPassword);
router.post('/SetNewpassword', NewpasswordSet);
router.post('/Newpassword', Newpassword);
module.exports = router;