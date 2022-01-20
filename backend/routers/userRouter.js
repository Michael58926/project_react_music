const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/user-token')

const userRouter = express.Router()

userRouter.post('/register', async (req, res) => {
  // check if the username is empty
  if (req.body.username === undefined || req.body.username === '') {
    return res.json({ status: 400, message: 'The username cannot be empty' })
  }

  // check if the username already exists
  let user = await User.findOne({ username: req.body.username })
  if (user) {
    return res.json({ status: 400, message: 'The username already exists' })
  }

  // check if the password is empty
  if (req.body.password === '') {
    return res.json({ status: 400, message: 'The password cannot be empty' })
  }

  // check if the two passwords are identical
  if (req.body.password !== req.body.password2) {
    return res.json({ status: 400, message: 'The two passwords do not match' })
  }

  // encrypt the password
  let salt = await bcrypt.genSalt(10)
  let encryptedPwd = await bcrypt.hash(req.body.password, salt)

  // save the user in database
  user = new User({
    username: req.body.username,
    password: encryptedPwd
  })
  await user.save()

  res.json({ status: 200, message: 'The user is created successfully' })
})

userRouter.post('/login', async (req, res) => {
  // check if the username exists
  let user = await User.findOne({ username: req.body.username })
  if (!user) {
    return res.json({ status: 400, message: 'The username does not exist' })
  }

  // check if the password is correct
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      status: 400,
      message: 'The username or password is incorrect'
    })
  }

  // generate a token
  let token = generateToken(user)

  user = {
    _id: user._id,
    username: user.username
  }

  return res.json({
    status: 200,
    message: 'Log in successfully',
    token,
    user
  })
})

module.exports = userRouter
