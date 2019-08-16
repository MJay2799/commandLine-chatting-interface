require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: process.env.INSTANCE,
  key:
    process.env.SECRET_KEY
    // 'c409ea43-2b0d-4889-9c2c-bef152550964:hvAyXG3a8RDyJDD4zr8Vuo8md48yMyHCNbpN4f5ZwWw='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User created: ${username}`)
      res.sendStatus(201)
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`)
        res.sendStatus(200)
      } else {
        res.status(err.status).json(err)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const port = 3001
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Running on port ${port}`)
  }
})




// const handleErr = fn => (...params) =>fn(...params).catch(console.error);

// or

// function handleErr(fn){
//   return function(...params){
//     return fn(...params).catch(function (err){
//       console.error('errr',err);
//     })  
//   }
// }