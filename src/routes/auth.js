const express = require('express')
const authRouter = express.Router()
const auth = require('../middleware/auth')
const UserModel = require('./users/schema')


//get pi/auth
authRouter.get("/", auth, async (req, res, next) => {
    console.log('auth', auth)
    try {
        const user = await UserModel.findById(req.user.id).select('-password')
        console.log('user', user)
        res.status(200).send(user)


    } catch (error) {
        next(error)

    }


})





module.exports = authRouter