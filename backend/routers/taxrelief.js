const express = require('express');
const router = express.Router();
const taxreliefController = require('../controllers/taxrelief');


//add a new tax relief category
router.post("/add/category", taxreliefController.addcategory);
//delete a relief category
router.delete("/delete/category", taxreliefController.deletecategory); //check this API through before implementing
//assign a user to a relief category
router.post("/assignuser", taxreliefController.assignUser);



module.exports = router;
