const pool = require("../db");
const calculateUserPAYE = require('./calculateUserPAYE')
const roundMoney = require('./roundMoney')



async function calculateUserNetPay(userid,period) {
    const PAYE = await calculateUserPAYE(userid,period)
    const grossEarnings = PAYE.grossEarnings
    const deductions = PAYE.deductions
    const userprovidentFund = PAYE.userprovidentFund
    const userPAYE = PAYE.PAYE
    // console.log('userPAYE', userPAYE)
    const NetPay =  roundMoney(grossEarnings - ( deductions + userprovidentFund + userPAYE ))
    const NetPayOBJ = {
        ...PAYE,
        NetPay: NetPay
    }
    return NetPayOBJ
}
module.exports = calculateUserNetPay;