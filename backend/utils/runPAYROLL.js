const pool = require("../db");
const calculateUserNetPay = require('./calculateUserNetPAY')
const roundMoney = require('./roundMoney')


async function runPayroll() {
    const [getusers] = await pool.query( `select id from employees` )
    const usersIdArray = getusers.map((item)=>item.id)
    // console.log(usersIdArray)

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
    const addUsertoSum = async (userid)=>{
        const user = await calculateUserNetPay(userid)
        //so we can save the user values here
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
        console.log(user)
    }
    for (let x=0; x<usersIdArray.length; x++){
        await addUsertoSum(usersIdArray[x])
    }

    return sumArray
}
module.exports = runPayroll;
