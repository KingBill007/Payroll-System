const express = require("express");
const app = express();
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny')); //log all API req in console


const usersRouter = require('./routers/user')
const salariesRouter = require('./routers/salary')
const allowancesRouter = require('./routers/allowance')
const deductionsRouter = require('./routers/deduction')
const providentRouter = require('./routers/providentfund')

const api = process.env.API_URL; //api variable
app.use(api+'/users', usersRouter)
app.use(api+'/salary', salariesRouter)
app.use(api+'/allowance', allowancesRouter)
app.use(api+'/deduction', deductionsRouter)
app.use(api+'/providentfund', providentRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});