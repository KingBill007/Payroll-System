const calculateuserAllw = require('../utils/calculateUserAllowance')
const calculateuserDeductions = require('../utils/calculateuserDeduction')

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
exports.userAllowance = async (req, res) => {
    const userid = req.query.id
    try {
        const userAllowance = await calculateuserDeductions(userid)

        res.status(200).json({
            success: true,
            message: userAllowance
        });
    } catch (error) {
        console.error("Failed to assign allowance type to grade:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}