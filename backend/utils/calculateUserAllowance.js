const pool = require("../db");

async function calculateuserAllw(userid) {
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
    
    //get all the allowances associated with his grade
    const [gradeAllowances] = await pool.query(
        `
        select *
        from grade_allowances
        where id = ? 
        `,[usersGradeId]
    );
    // console.log('gradeAllowances:', gradeAllowances)
    
    //users allowance types ids in array form
    const allowancetypesids = gradeAllowances.map((item)=>item.allowance_type_id)
    // console.log('allowancetypesids:',allowancetypesids)

    //get all users allowance types in the array
    const [allowancetypes] = await pool.query(
        `
        select *
        from allowance_types
        where id in (?)
        `,[allowancetypesids]
    )
    //console.log('allowancetypes:', allowancetypes)

    //get Notch amount / Actual Salary
    const [getSalary] = await pool.query(
        ` select amount from salarynotch where id = ?`,
        [user[0].notchId]
    );
    const salary = Number(getSalary[0].amount);
    // console.log('salary:', salary)

    var sumAllowance = 0;
    for( x=0; x<allowancetypes.length; x++){
        const type = allowancetypes[x] 
        const calctype  = type.calculation_type;
        //compare current allowance type to its correspondent in the grade allowances
        const allwtype = gradeAllowances.find((item)=>item.allowance_type_id === type.id) //create an error or handler for when it cant be found
        
        //calculate the allowance of the current allowance type (PERCENTAGE) or grade allowance(FIXED)
        let currentAllw
        if(calctype==="PERCENTAGE"){
            currentAllw = (Number(allwtype.amount)/100) * salary
        } else if (calctype==="FIXED"){
            currentAllw = gradeAllowances.amount
        } else {
            console.log('invalid allowance type calculation!') //look at what to do here later
            currentAllw = 0;
        }
        sumAllowance+=currentAllw; //increase the sum allowance with the current allowance
    }
    console.log('total allowance:', sumAllowance)
    return sumAllowance;
}

module.exports = calculateuserAllw;