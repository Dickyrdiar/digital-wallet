const jwt = require('jsonwebtoken')
const user = require('../model/user')

exports.verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function (err, decode) {
      if (err) req.user = undefined
      user.findOne({
        _id: decode._id
      })

        .exec((err, user) => {
          if (err) {
            res.status(500)
              .send({
                message: err
              })
          } else {
            req.user = user
            next()
          }
        })
    })
  } else {
    req.user = undefined
    next()
  }
}

// exports.isUser = async (req, res, next) => {
//   if (req.user.user_type_id === 0) {
//     next()
//   }

//   return res.status(401).send('Unauthorized!')
// }
