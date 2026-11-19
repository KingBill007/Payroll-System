const pool = require("../db");
const calculateUserNetPay = require('./calculateUserNetPAY')
const roundMoney = require('./roundMoney')


async function runPayroll(periodId) {
    const [getusers] = await pool.query( `select id from employees` )
    const usersIdArray = getusers.map((item)=>item.id)
    // console.log('period id: ',periodId)

    //get your period data
    const [perioddata] = await pool.query(
        `
        select * from payroll_periods 
        where id = ?
        `,[periodId]
    )
    const period = perioddata[0]
    // console.log('period:', period)

    let sumArray = {
        salary: 0,
        allowance: 0,
        grossEarnings: 0,
        deductions: 0,
        userprovidentFund: 0,
        employerprovidentFund: 0,
        usertaxRelief: 0,
        chargeableIncome: 0,
        PAYE: 0,
        NetPay: 0
    }
    let usersDetails = []
    const addUsertoSum = async (userid)=>{
        const user = await calculateUserNetPay(userid,period)
        //so we can save the user values here to payroll_recods
        sumArray = {
            salary: sumArray.salary + user.salary,
            allowance: sumArray.allowance + user.allowance,
            grossEarnings: sumArray.grossEarnings + user.grossEarnings,
            deductions: sumArray.deductions + user.deductions,
            userprovidentFund: sumArray.userprovidentFund + user.userprovidentFund,
            employerprovidentFund: sumArray.employerprovidentFund + user.employerprovidentFund,
            usertaxRelief: sumArray.usertaxRelief + user.usertaxRelief,
            chargeableIncome: sumArray.chargeableIncome + user.chargeableIncome,
            PAYE: roundMoney(sumArray.PAYE + user.PAYE),
            NetPay: roundMoney(sumArray.NetPay + user.NetPay)
        }
        usersDetails.push(user)
        // console.log(user)
    }
    // await addUsertoSum(usersIdArray[0])
    for (let x=0; x<usersIdArray.length; x++){
        await addUsertoSum(usersIdArray[x])
    }
    //save sum data to payroll_runs
    const [savePayroll] = await pool.query(
    `
    insert into payroll_runs(
        payrollPeriodId , status , totalSalary, totalAllowance, totalGrossEarnings, totalDeductions,
        totalUserprovidentFund, totalEmployerprovidentFund, totalUsertaxRelief, totalChargeableIncome,
        totalPAYE, totalNetPay
    )
    values(?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
        periodId,"Calculated",sumArray.salary,sumArray.allowance,sumArray.grossEarnings,sumArray.deductions,
        sumArray.userprovidentFund,sumArray.employerprovidentFund,sumArray.usertaxRelief,
        sumArray.chargeableIncome,sumArray.PAYE,sumArray.NetPay
    ]
    )

    // console.log(savePayroll)
    // console.log(usersDetails[0],usersDetails[1])
    
    //insert every users data to payroll_records
    const payrollRunId = savePayroll.insertId
    if(usersDetails.length>0){
        for(let x=0; x<usersDetails.length; x++){
            const person = usersDetails[x]
            await pool.query(
                `
                insert into payroll_records(
                    payrollRunId, employeeId, status, first_name, last_name, email, salary, allowance, 
                    grossEarnings, deductions, userprovidentFund, usertaxRelief, chargeableIncome, PAYE,NetPay
                )
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                `,[
                    payrollRunId, person.id, "Calculated", person.first_name, person.last_name, person.email, person.salary, person.allowance, 
                    person.grossEarnings, person.deductions, person.userprovidentFund, person.usertaxRelief, person.chargeableIncome, 
                    person.PAYE, person.NetPay
                ]
            )
        }
    }

    return sumArray
}
module.exports = runPayroll;
