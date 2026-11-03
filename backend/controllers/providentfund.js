
const pool = require("../db");

exports.getProvidentFund = async (req, res) => {
    try {
        const [result] = await pool.query(
            `
            select * from provident_fund
            `
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to get PF", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.updatePF = async (req, res) => {
    const {employerPF, employeePF} = req.body || {}
    try {
        //if provident fund is empty fill with empty row
        const [isfilled] = await pool.query(
            `select * from provident_fund`
        );
        if (isfilled.length<1){
            await pool.query(
                `
                insert into provident_fund ()
                values ()
                `
            )
        }
        //update all rows in provident fund
        const [result] = await pool.query(
            `
            update provident_fund
            set employerPF = ?,
                employeePF = ?
            `,[employerPF, employeePF]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("Failed to update PF", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}