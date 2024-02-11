const express = require("express");
const { allReport, createReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/create", createReport);
router.get("/", allReport);
module.exports = router;
