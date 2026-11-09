const pool = require("../db");

async function getUserTaxRelief(userid) {
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
        `
    )
    return reliefDetails
}
module.exports = getUserTaxRelief;