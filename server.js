const express = require ('express')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./src/routes/users/index')
const postsRouter = require('./src/routes/posts/index')
const profilesRouter = require('./src/routes/profiles/index')
const authRouter = require('./src/routes/auth')

const app = express()
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())




app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/profiles", profilesRouter)
app.use("/auth", authRouter)




const PORT = process.env.PORT || 4000
const mongo_uri =  process.env.MONGO_URI
console.log(mongo_uri)


mongoose
  .connect(mongo_uri
   ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error));


