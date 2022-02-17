const express = require('express')
const profilesRouter = express.Router()


profilesRouter.get("/",(req,res,next)=>{
    res.send('love coding')

})





module.exports = profilesRouter