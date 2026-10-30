const pool = require("../db");

exports.addSalaryGrade = async (req, res) => {
    const {name} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO salarygrade( name )
            Values( ? )
            `,[name]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add grade:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add grade"
        });
    }
}
exports.addSalaryNotch = async (req, res) => {
    const {gradeId, notchNum, amount} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO salarynotch( salaryGradeId, notchNumber, amount )
            Values( ? , ? , ? )
            `,[gradeId, notchNum, amount]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add notch:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.getGradeNotches = async (req, res) => {
    const gradeId = req.query.gradeId
    try {
        const [result] = await pool.query(
            `
            select * 
            from salarynotch
            where salaryGradeId = ?
            `,[gradeId]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add notch:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}