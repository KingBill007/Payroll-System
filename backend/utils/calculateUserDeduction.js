const pool = require("../db");

async function calculateuserDeductions(userid) {
    //get users info with salary grade
    const [user] = await pool.query(
        `
        select 
            employees.salaryGradeId,
            employees.notchId,
            salarygrade.name as salarygradeName
        from employees 
        join salarygrade
        on employees.salaryGradeId = salarygrade.id
        where employees.id = ?
        `,[userid]
    );

    //users salary grade id
    const usersGradeId = user[0].salaryGradeId;
    
    //get all the deductions associated with his grade
    const [gradeDeductions] = await pool.query(
        `
        select *
        from grade_deductions
        where id = ? 
        `,[usersGradeId]
    );
    console.log('gradeDeductions:', gradeDeductions)
    
    //save users deduction types ids in array form
    const deductiontypesids = gradeDeductions.map((item)=>item.deduction_type_id)
    console.log('deductiontypesids:',deductiontypesids)

    //get all users allowance types in the array
    const [deductiontypes] = await pool.query(
        `
        select *
        from deduction_types
        where id in (?)
        `,[deductiontypesids]
    )
    console.log('deductiontypes:', deductiontypes)

    //get Notch amount / Actual Salary
    const [getSalary] = await pool.query(
        ` select amount from salarynotch where id = ?`,
        [user[0].notchId]
    );
    const salary = Number(getSalary[0].amount);
    console.log('salary:', salary)

    var sumDeductions = 0;
    for( x=0; x<deductiontypes.length; x++){
        const type = deductiontypes[x] 
        const calctype  = type.calculation_type;
        //compare current allowance type to its correspondent in the grade allowances
        const deductiontype = gradeDeductions.find((item)=>item.deduction_type_id === type.id) //create an error or handler for when it cant be found
        
        //calculate the allowance of the current allowance type (PERCENTAGE) or grade allowance(FIXED)
        let currentDeduction
        if(calctype==="PERCENTAGE"){
            currentDeduction = (Number(deductiontype.amount)/100) * salary
        } else if (calctype==="FIXED"){
            currentDeduction = gradeDeductions.amount
        } else {
            console.log('invalid deduction type calculation!') //look at what to do here later
            currentDeduction = 0;
        }
        sumDeductions+=currentDeduction; //increase the sum allowance with the current allowance
    }
    console.log('total deductions:', sumDeductions)
    return sumDeductions;
}

module.exports = calculateuserDeductions;