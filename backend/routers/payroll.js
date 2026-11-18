const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll');

//add a payroll period
router.post("/add/period", payrollController.addPayrollPeriod);
//Run payroll
router.get("/runpayroll", payrollController.RunPayroll);

module.exports = router;
