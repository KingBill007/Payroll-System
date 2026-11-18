// const calculateuserAllw = require('../utils/calculateUserAllowance')
// const calculateuserDeductions = require('../utils/calculateUserDeduction')
// const calculateusersPF = require('../utils/calculateUserPF')
// const calculateUserChargeableIncome = require('../utils/calculateUserChargeableIncome')
// const getUserTaxRelief = require('../utils/getUserTaxRelief')
// const calculateUserPAYE = require('../utils/calculateUserPAYE')
// const calculateUserNetPay = require('../utils/calculateUserNetPAY')
const runPayroll = require('../utils/runPAYROLL')
const pool = require("../db");

exports.addAllwType = async (req, res) => {
    const {name, description, calculationtype, min, max, durationMonths} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO allowance_types( name , description, calculation_type, minimum, maximum, durationMonths )
            Values( ? , ? , ?, ?, ?, ? )
            `,[name, description, calculationtype, min, max, durationMonths]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add allowance type:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.assignGradeToAllw = async (req, res) => {
    const {salaryGradeId, allwTypeId, amount} = req.body || {}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO grade_allowances( salary_grade_id , allowance_type_id, amount )
            Values( ?, ?, ? )`,[salaryGradeId, allwTypeId, amount]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to assign allowance type to grade:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
//Test API (to test functions) --> Run payroll
exports.testController = async (req, res) => { 
    const userid = req.query.userid
    try {
        const result = await runPayroll()

        res.status(200).json({
            success: true,
            message: `Run Payroll `,
            value: result
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}