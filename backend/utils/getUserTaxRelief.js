const pool = require("../db");

async function getUserTaxRelief(userid, period) {

    const startDate = new Date(period.startDate)
    const endDate = new Date(period.endDate)
    const startYear = startDate.getUTCFullYear();
    const endYear = endDate.getUTCFullYear();

    const [reliefDetails] = await pool.query(
        `
        select 
            assigned_tax_relief.relief_category_id as taxReliefId,
            assigned_tax_relief.amount,
            assigned_tax_relief.tax_year,
            tax_relief_categories.name
        from assigned_tax_relief
        join tax_relief_categories
        on assigned_tax_relief.relief_category_id = tax_relief_categories.id
        where employee_id = ?
        and cast (assigned_tax_relief.tax_year as unsigned)
            between ? and ?
        or employee_id = ? and assigned_tax_relief.tax_year is null
        `,[userid, startYear, endYear, userid]
    )
    // console.log(reliefDetails)
    return reliefDetails //remember later this should work with the year assigned to it
}
module.exports = getUserTaxRelief;