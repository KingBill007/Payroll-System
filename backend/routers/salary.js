const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary');


//add an salary grade
router.post("/add/salarygrade", salaryController.addSalaryGrade);
//add an salary notch
router.post("/add/salarynotch", salaryController.addSalaryNotch);
//get the notches of a salary grade
router.get("/salarygrade/notches", salaryController.getGradeNotches);



module.exports = router;
