const pool = require("../db");

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM employees"
        );
        console.log()

        res.status(200).json({
            success: true,
            employees: rows
        });
    } catch (error) {
        console.error("Failed to retrieve employees:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.addEmployee = async (req, res) => {
    const {first_name, last_name, email} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            INSERT INTO employees( first_name, last_name, email )
            Values( ? , ?, ? )
            `,[first_name, last_name, email]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to add an employee:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add employee"
        });
    }
}
exports.setEmployeeSalaryGradeNotch = async (req, res) => {
    const {gradeId, notchId, userId} = req.body ||{}
    try {
        const [result] = await pool.query(
            `
            UPDATE employees
            SET salaryGradeId = ?,
                notchId = ?
            WHERE id = ?;
            `,[gradeId, notchId, userId]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to set employee grade and notch:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}