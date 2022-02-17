const express = require('express')
const usersRouter = express.Router()


usersRouter.get("/",(req,res,next)=>{
    res.send('love coding')

})





module.exports = usersRouter