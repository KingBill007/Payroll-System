const express = require('express');
const router = express.Router();
const allowanceController = require('../controllers/allowance');



//add an allowance type
router.post("/add/allowancetype", allowanceController.addAllwType);
//asign a grade to an allowance
router.post("/add/gradeallowance", allowanceController.assignGradeToAllw);
// TEST API --- 
router.get("/test", allowanceController.testController);

module.exports = router;
