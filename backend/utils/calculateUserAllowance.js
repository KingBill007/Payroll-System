const pool = require("../db");
const getUserSalary = require('./getUserSalary')


async function calculateuserAllw(userid) {
    //get users info with salary grade
    const [user] = await pool.query(
        `
        select 
            employees.id,
            employees.first_name,
            employees.last_name,
            employees.email,
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
    
    // if the user doesnt have any grade Allowances return 0
    if(gradeAllowances.length<1){
        return 0;
    }
    
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
    // console.log('allowancetypes:', allowancetypes)

    const salary = await getUserSalary(userid,user[0].notchId)
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
    // console.log('total allowance:', sumAllowance)
    const employee = {
        id: user[0].id,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        email: user[0].email,
        allowance: sumAllowance
    }
    return employee;
}

module.exports = calculateuserAllw;