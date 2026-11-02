const pool = require("../db");


exports.addDeductionType = async (req, res) => {
    const {name, description, calculationtype} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO deduction_types( name , description, calculation_type )
            Values( ? , ? , ? )
            `,[name, description, calculationtype]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add deduction type:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.assignGradeToDeduction = async (req, res) => {
    const {salaryGradeId, deductionTypeId, amount} = req.body || {}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO grade_deductions( salary_grade_id , deduction_type_id, amount )
            Values( ?, ?, ? )`,[salaryGradeId, deductionTypeId, amount]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to assign deduction type to grade:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}