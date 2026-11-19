const pool = require("../db");
const getUserSalary = require('./getUserSalary')
const calculateUserAllowance = require('./calculateUserAllowance')
const calculateuserDeductions = require('./calculateUserDeduction')
const calculateuserPF = require('./calculateUserPF')
const getUserTaxRelief = require('./getUserTaxRelief')

async function calculateUserChargeableIncome(userid,period) {
    //Additions
    const salary = await getUserSalary(userid)    
    const user = await calculateUserAllowance(userid)
    const allowance = user.allowance
    const grossEarnings = salary + allowance
    
    
    //Deductions
    const deductions = await calculateuserDeductions(userid)
    
    const providentFund = await calculateuserPF(userid)
    const userprovidentFund = providentFund.employeePF
    
    const taxRelief = await getUserTaxRelief(userid, period)
    const usertaxRelief = taxRelief.length > 0 ? Number(taxRelief[0].amount) : 0 //really have to work on the particular year later

    
    const totalDeductions = deductions + userprovidentFund + usertaxRelief //total deductions
    const chargeableIncome = grossEarnings - totalDeductions  //chargeable income

    const response = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        salary: salary,
        allowance: allowance,
        grossEarnings: grossEarnings,
        deductions: deductions,
        userprovidentFund: userprovidentFund,
        employerprovidentFund: providentFund.employerPF,
        usertaxRelief: usertaxRelief,
        chargeableIncome: chargeableIncome
    }
    // console.log(response)
    return response
}
module.exports = calculateUserChargeableIncome;