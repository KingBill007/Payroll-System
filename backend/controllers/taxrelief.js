const pool = require("../db");

exports.addcategory = async (req, res) => {
    const {name, countryCode, maxAmount, taxYear} = req.body
    try {
        const [rows] = await pool.query(
            `
            insert into tax_relief_categories(
                name, country_code, max_amount, tax_year
            )
            values( ?, ?, ?, ? )
            `,[name, countryCode, maxAmount, taxYear]
        );

        res.status(200).json({
            success: true,
            employees: rows
        });
    } catch (error) {
        console.error("Failed to create relief category:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.deletecategory = async (req, res) => {
    const {categoryId} = req.body
    try {
        const [rows] = await pool.query(
            `
            delete from tax_relief_categories
            where id = ?
            `,[categoryId]
        );

        res.status(200).json({
            success: true,
            employees: rows
        });
    } catch (error) {
        console.error("Failed to create relief category:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.assignUser = async (req, res) => {
    const {employeeId, taxReliefCategoryId, taxYear} = req.body
    const amount = Number(req.body.amount) 
    try {
        //check if amount doesnt exceed the relief category max amount
        const [reliefCategory] = await pool.query(
            `
            select * from tax_relief_categories
            where id = ?
            `,[taxReliefCategoryId]
        );
        // console.log(reliefCategory)
        const maxAmount = Number(reliefCategory[0].max_amount);
        if(amount > maxAmount){
            return res.json({
                success: false,
                message: "Amount exceeds max amount"
            })
        }
        
        const [saveAssignment] = await pool.query(
            `
            insert into assigned_tax_relief(
            employee_id, relief_category_id, amount, tax_year
            )
            values(?,?,?,?)
            `,[employeeId, taxReliefCategoryId, amount, taxYear]
        );
        res.status(200).json({
            success: true,
            employees: 'Succesfully assigned user to tax relief category'
        });
    } catch (error) {
        console.error("Failed to assign user to relief category:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}