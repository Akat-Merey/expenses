const express = require("express");
const app = express();
const expensesRouter = require('./routes/expenses')

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status:'ok',
        message:'App is running'
    })
})

app.use('/expenses', expensesRouter)

module.exports = app;