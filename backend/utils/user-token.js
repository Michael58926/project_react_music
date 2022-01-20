const jwt = require('jsonwebtoken')

const generateToken = function (user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '2d' }
  )
}

const isAuth = function (req, res, next) {
  //check if there is a token
  let authorization = req.headers.authorization
  if (!authorization) {
    return res.json({ status: 400, message: 'No Token' })
  }

  //check if the token is correct
  let token = authorization.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ status: 400, message: 'Invalid Token' })
    }

    next()
  })
}

module.exports = { generateToken, isAuth }
