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

// get all posts
postsRouter.get("/", auth, async(req,res,next)=>{
    try {
        const posts = await PostModel.find().sort({date:-1})
        res.json(posts)
        
    } catch (error) {
        next(error)
        
    }
})

//get post by id
postsRouter.get("/:id", auth, async(req,res,next)=>{
    try {
        const post = await PostModel.findById(req.params.id)
       if(post){
           res.status(200).json({msg:post})
       }
       res.status(400).json({msg:'post not found'})
        
    } catch (error) {
        next(error)
        
    }
})

//delete post
postsRouter.delete("/:id", auth, async(req,res,next)=>{
    try {
        const post = await PostModel.findById(req.params.id)
        console.log('post', post)
       //check user i.e if the logged in user(req.user.id) is different from the user who posted(post.user)
       if(post.user.toString()!== req.user.id){{
           return res .status(401).json({msg:'user not authorised'})
       }}
       await post.remove()
       res.json({msg:'post removed'})
        
    } catch (error) {
        next(error)
        
    }
})

// add likes
//put post/like/:id
postsRouter.put("/like/:id", auth, async(req,res,next)=>{
    try {
        const post = await PostModel.findById(req.params.id)
        // check if the post has been liked
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length >0){
            return res.json(400).json({msg:'post has already been liked'})
        }
        post.likes.unshift({user:req.user.id})
        await post.save()
        res.json(post.likes)
        
    } catch (error) {
        next(error)
        
    }
})


// @route PUT api/posts/like/:id
// @desclike a post 
// @access private

postsRouter.put('/unlike/:id', auth, async(req,res,next)=>{
    try {

        const post = await PostModel.findById(req.params.id)
        // check if post has already been liked
        if(post.likes.filter(like=>like.user.toString()=== req.user.id ).length ===0){
            return res.status(400).json({msg:'post has not yet been liked'})
        } else{
            //get removeindex

        const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1)

        await post.save()
        res.json(post.likes)
        }
        
        
    } catch (error) {
        next(error)
    }
})

// @route POST api/posts/comment/:id
// @desc comment on post
// @access private
postsRouter.post("/comment/:id", auth, async (req,res,next)=> {
    try {
        const user  = await UserModel.findById(req.user.id).select('-password');
        const post = await PostModel.findById(req.params.id)
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
    
        }

        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    } catch (error) {
        next(error)
        
    }
   
})

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Delete Comment
// @access private

postsRouter.delete('/comment/:id/:comment_id', auth,async(req,res,next)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        // pull out comment
        const comment = post.comments.find(comment=>comment.id=== req.params.comment_id)
        // Make sure comment exists
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'})
        }

        // check user
        if(comment.user.toString()!== req.user.id){
            return res.status(404).json({msg: 'User not authoried'})
        }

        // get remove index

        const removeIndex = post.comments.map(comment=> comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex,1)

        await post.save()
        res.json(post.comments)
        
    } catch (error) {
        next(error)
        
    }
})





module.exports = postsRouter