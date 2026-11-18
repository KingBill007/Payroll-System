const pool = require("../db");
const runPayroll = require('../utils/runPAYROLL')


//add a payroll period
exports.addPayrollPeriod = async (req, res) => {
    const {name, startDate, endDate} = req.body
    try{
        const status = 'Open'
        await pool.query(
            `
            insert into payroll_periods(
            name, startDate, endDate, status
            )
            values(?,?,?,?)
            `,[name, startDate, endDate, status]
        )
        res.status(200).json({
            success: true,
            message: "Period Sucessfully Added"
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
//run payroll
exports.RunPayroll = async (req, res) => {
    try{
        const result = await runPayroll()
        res.status(200).json({
            success: true,
            message: result
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}