const express = require('express')
const profilesRouter = express.Router()
const ProfileModel = require('./schema')
const UserModel = require('../users/schema')
const auth = require('../../middleware/auth')

// get current user profile
profilesRouter.get("/me", auth, async(req,res,next)=>{
    try {
        const profile = await ProfileModel.findOne({user:req.user.id}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).send('there is no profile for this user')
        }
        res.send(profile)
    } catch (error) {
        next(error)
    }
})





module.exports = profilesRouter