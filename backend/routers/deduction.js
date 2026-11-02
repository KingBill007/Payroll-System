const express = require('express');
const router = express.Router();
const deductionController = require('../controllers/deduction');

//add an deduction type
router.post("/add/deductiontype", deductionController.addDeductionType);
//asign a grade to a deduction
router.post("/add/gradededuction", deductionController.assignGradeToDeduction);


module.exports = router;
