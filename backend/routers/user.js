const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

//get all employees
router.get("/employees", userController.getAllEmployees );
//add an employee
router.post("/add/employee", userController.addEmployee);
//set employees salary grade and notch
router.put("/set/gradeNotch", userController.setEmployeeSalaryGradeNotch);


module.exports = router;
