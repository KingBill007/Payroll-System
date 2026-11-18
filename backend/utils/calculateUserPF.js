const pool = require("../db");
const getUserSalary = require('./getUserSalary')
const getPFRates = require('./getPFRates')


//calculates all users PF
async function calculateusersPF(userid) {

    //check if employee is enrolled to PF 
    const [enrollment] =  await pool.query(
        `
            select * from enrolled_pf
            where employee_id = ?
        `,[userid]
    )
    //if not enrolled return 0 for each value
    if (enrollment.length<1){
        return {
            employeePF: 0,
            employerPF: 0
        } 
    }

    const PFRates = await getPFRates()

    const employerPFRate = PFRates[0].employerPF
    const employeePFRate = PFRates[0].employeePF


    const salary = await getUserSalary(userid)
    
    const employeePF = (employeePFRate/100) * salary
    const employerPF = (employerPFRate/100) * salary
    
    return {
        employeePF: employeePF,
        employerPF: employerPF
    }
}
module.exports = calculateusersPF;
