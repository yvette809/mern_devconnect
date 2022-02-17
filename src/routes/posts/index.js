const express = require('express')
const postsRouter = express.Router()


postsRouter.get("/",(req,res,next)=>{
    res.send('love coding')

})





module.exports = postsRouter