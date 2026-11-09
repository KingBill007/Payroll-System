const pool = require("../db");

async function getUserSalary(userid, notchid) {

    let notchID ;
    if(notchid){
        notchID = notchid
    }else {
        //get users notch id
        const [user] = await pool.query(
            `
            select 
                employees.notchId
            from employees 
            where employees.id = ?
            `,[userid]
        );
        // console.log('user:', user)
        notchID = user[0].notchId
    }
    


    // Actual Salary
    const [getSalary] = await pool.query(
        ` select amount from salarynotch where id = ?`,
        [notchID]
    );
    const salary = Number(getSalary[0].amount);
    // console.log('salary:', salary)

    return salary
}
module.exports = getUserSalary;