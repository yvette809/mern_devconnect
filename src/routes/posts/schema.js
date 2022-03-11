const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text:{
        type: String,
        required:[true,'Text is required']
    },
    name:{
        type: String
    },
    avatar:{
        type: String
    },
    likes:[
        {
        user:{
            type: Schema.Types.ObjectId,
            ref:'user'
        }
    }
],

    comments:[
        {
        user:{
            type: Schema.Types.ObjectId,
            ref:'user'
        },
        text:{
            type: String,
            required:true
        },
        name:{
            type: String
        },
        date:{
            type:Date,
            default: Date.now
        }

    }
],
    date:{
        type:Date,
        default: Date.now
    }
})

const PostModel = mongoose.model('post', PostSchema)
module.exports = PostModel;