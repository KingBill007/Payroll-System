const pool = require("../db");
const getchargeableIncome = require('./calculateUserChargeableIncome')
const roundMoney = require('./roundMoney')

async function calculateUserPAYE(userid) {
    const chargeableIncome = await getchargeableIncome(userid)
    const [taxBrackets] = await pool.query(
        `
        select * from tax_brackets
        order by lowerLimit
        `
    );
    // console.log(taxBrackets)
    let PAYE = 0, remainder = chargeableIncome.chargeableIncome
    // console.log(`PAYE ${PAYE}, Remainder: ${remainder}`)

    for (let x=0; x<taxBrackets.length; x++){
        const currentBracket = taxBrackets[x]
        const lowerLimit = Number(currentBracket.lowerLimit)
        const upperLimit = Number(currentBracket.upperLimit)
        const difference = upperLimit - lowerLimit
        const value = Number(currentBracket.value)

        if(lowerLimit <= remainder && upperLimit){
            PAYE += value
            remainder -= difference
            // console.log(`PAYE ${PAYE}, Remainder: ${remainder} bracketId: ${currentBracket.id}`)
        } else if (lowerLimit <= remainder && !upperLimit){
            PAYE += value
            // console.log(`PAYE ${PAYE}, Remainder: ${remainder} bracketId: ${currentBracket.id}`, 'LAST')
        }
    }
    // console.log(roundMoney(PAYE))
    const PAYEOBJ = {
        ...chargeableIncome,
        PAYE: roundMoney(PAYE)
    }

    return PAYEOBJ

}
module.exports = calculateUserPAYE;