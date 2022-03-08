
const express = require('express')
const usersRouter = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('./schema')
const { JsonWebTokenError } = require('jsonwebtoken')


// register a user

usersRouter.post("/register", async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        // see if user exists
        let user = await UserModel.findOne({ email });
        if (user) {
            res.status(400).json({ msg: "user already exists" });
        } else {
            // get users gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            //hash password
            const salt = await bcrypt.genSalt(10)
            const harsedPassword = await bcrypt.hash(password, salt)

            // create user and replace user's password with the harsdpassword

            user = new UserModel({
                name,
                email,
                password: harsedPassword
            });

            if (user) {
                res.json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                })
            }


        }
    } catch (error) {
        next(error);
    }
});

// login user
usersRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    //check for user email
    const user = await UserModel.findOne({ email })
    // if the user is found, compare its password from req.body with the harsed password before returning the token
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        })
    } else {
        res.status(400).send('invalid user data')
    }
})




// get all users
usersRouter.get("/", (req, res, next) => {
    try {
        const users = UserModel.find(req.query)
        res.status(200).send(users)

    } catch (error) {
        console.log(error)

    }


})

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.jwt_secret, {
        expiresIn: '30d'
    })
}





module.exports = usersRouter