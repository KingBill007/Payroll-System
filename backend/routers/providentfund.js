const express = require('express');
const router = express.Router();
const providentController = require('../controllers/providentfund');

//get current provident fund
router.get("/display", providentController.getProvidentFund);
//update current provident fund values
router.put("/update", providentController.updatePF);

module.exports = router;