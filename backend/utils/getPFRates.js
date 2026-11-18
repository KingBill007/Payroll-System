const pool = require("../db");

//get the Provident Fund Rates
async function getPFRates() {
    const [providentFundRates] = await pool.query(
        `
        select * from provident_fund
        `
    )
    return providentFundRates
}
module.exports = getPFRates;
