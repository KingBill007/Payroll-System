const express = require('express');
const router = express.Router();
const taxbracketController = require('../controllers/taxbracket');


//add a new tax bracket
router.post("/add", taxbracketController.addTaxBracket);
//get all tax brackets
router.get("/display", taxbracketController.getTaxBrackets);
//delete a tax bracket
router.delete("/delete/single", taxbracketController.deleteTaxBracket);
//update a tax bracket
router.put("/update/single", taxbracketController.updateTaxBracket);


module.exports = router;
