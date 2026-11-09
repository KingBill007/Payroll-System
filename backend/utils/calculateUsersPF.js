const pool = require("../db");
const getUserSalary = require('./getUserSalary')

async function calculateusersPF() {


    const [providentFundRates] = await pool.query(
        `
        select * from provident_fund
        `
    )
    console.log(providentFundRates)
    const employerPFRate = providentFundRates[0].employerPF
    const employeePFRate = providentFundRates[0].employeePF
    const [PFemployees] = await pool.query(
        `
        select employee_id from enrolled_pf
        `
    )
    // const arrayEmployees = PFemployees.map((item)=>item.employee_id)
    // console.log(arrayEmployees)

    var sumEmployeePF=0, sumEmployerPF = 0;

    for(let x=0; x<PFemployees.length; x++){
        // console.log(PFemployees[x].employee_id)
        const salary = await getUserSalary(PFemployees[0].employee_id)
        // console.log(salary)
        const employeePF = (employeePFRate * 0.01) * salary
        const employerPF = (employerPFRate * 0.01) * salary
        sumEmployeePF += employeePF
        sumEmployerPF += employerPF
    }
    // console.log(sumEmployeePF,sumEmployerPF)



    return {
        sumEmployeePF: sumEmployeePF,
        sumEmployerPF: sumEmployerPF
    }
}
module.exports = calculateusersPF;
