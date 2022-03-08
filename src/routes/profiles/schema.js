
const mongoose = require("mongoose")

const ProfileSChema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type: String
    },
    status:{
        type: String,
        required:[true, 'status is required']
    }, 
    skills:{
        type:[String],
        required:[true, 'skills is required']
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience:[
        {
            title:{
                type:String,
                required:true
            },

            company:{
                type: String,
                required:true
            },

            location:{
                type:String
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date
               
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    education:[
        {
            school:{
                type:String,
                required:[true, 'school is required']
            },
            degree:{
                type:String,
                required:[true, 'degree is required']
            },
            fieldOfStudy:{
                type:String,
                required:[true, 'field of study is required']
            },
            from:{
                type:Date,
                required:[true, 'from is required']
            },
            to:{
                type:Date
               
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    social:{
        youtube:{
            type:String
        },
        twitter:{
            type:String
        },
        facebook:{
            type:String
        },
        linkedIn:{
            type: String
        },
        instagram:{
            type: String
        }
    }
})

const ProfileModel = mongoose.model("profile", ProfileSChema)

module.exports= ProfileModel;