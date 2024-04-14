const express = require("express");
const { 
    registerUser, 
    authUser,
    allUsers,
    updateUserProfile,
    handleSoftDelete,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router =  express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/update-profile").post(protect, updateUserProfile);
router.route("/softdelete").post(handleSoftDelete);

module.exports = router;
