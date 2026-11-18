const pool = require("../db");

exports.addTaxBracket = async (req, res) => {
    const {lowerLimit, upperLimit, rate} = req.body ||{}
    try {
        const difference = upperLimit - lowerLimit
        if (difference<=0 && upperLimit) return res.json({
            success: false,
            message: 'Invalid Limits'
        })

        let value ;
        if (!upperLimit){
            value = null
        } else {
            value = (rate/100) * difference
        }

        const [result] = await pool.query(
            `
            INSERT INTO tax_brackets( 
                lowerLimit, upperLimit, rate, value
            )
            Values( ? , ? , ? , ? )
            `,[lowerLimit, upperLimit, rate, value]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.getTaxBrackets = async (req, res) => {
    try {
        const [result] = await pool.query(
            `
            select * from tax_brackets
            order by lowerLimit
            `
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.deleteTaxBracket = async (req, res) => {
    const {bracketId} = req.body
    try {
        const [result] = await pool.query(
            `
            delete from tax_brackets
            where id = ?
            `,[bracketId]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.updateTaxBracket = async (req, res) => {
    const {lowerLimit, upperLimit, rate, bracketId} = req.body
    try {
        const difference = upperLimit-lowerLimit
        if (difference <= 0){
            return res.status(401).json({
            success: false,
            message: 'invalid limits'
        });
        }
        const value = (rate/100) * difference
        const [result] = await pool.query(
            `
            update tax_brackets
            set 
                lowerLimit = ?, 
                upperLimit = ?, 
                rate = ?, 
                value = ?
            
            where id = ?
            `,[lowerLimit, upperLimit, rate, value, bracketId]
        );

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}