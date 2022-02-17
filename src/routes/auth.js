const express = require('express')
const authRouter = express.Router()


authRouter.get("/",(req,res,next)=>{
    res.send('love coding')

})





module.exports = authRouter