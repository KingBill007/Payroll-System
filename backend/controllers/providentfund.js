
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
exports.enrollEmployee = async (req, res) => {
    const {employeeID, action} = req.body || {}
    try {
        if (action === 'enroll'){
            await pool.query(
                `
                insert into enrolled_pf(
                    employee_id
                )
                values(
                    ?
                )
                `,[employeeID]
            );
            res.status(200).json({
                success: true,
                message: 'User sucessfully enrolled for provident fund'
            });
        } else if(action === 'deroll'){
            await pool.query(
                `
                    delete from enrolled_pf
                    where employee_id = ?
                `,[employeeID]
            );
            res.status(200).json({
                success: true,
                message: 'User sucessfully delisted from provident fund'
            });
        }else {
            res.json({
            success: false,
            message: 'No valid action'
        });
        }

    } catch (error) {
        console.error("Failed to enroll employee", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}