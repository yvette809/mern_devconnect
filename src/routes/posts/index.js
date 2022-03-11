const express = require('express')
const postsRouter = express.Router()
const PostModel = require('./schema')
const UserModel = require('../users/schema')
const ProfileModel = require('../profiles/schema')
const auth = require('../../middleware/auth')


// add a post
postsRouter.post("/", auth, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password')

        const newPost = new PostModel({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
     const post = await newPost.save()
        res.json(post)

    } catch (error) {
        next(error)
    }


})





module.exports = postsRouter