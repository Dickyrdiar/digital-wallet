/* eslint-disable new-cap */
const user = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const stripe = require('../shared/stripe.js')

// findAll
exports.findAll = async (req, res) => {
  try {
    const findAllUser = await user.find()
    return res.send({ message: 'get all data succes', users: findAllUser })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: error.message || 'iternal server error' })
  }
}

// register
exports.SigupUsers = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await user.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exist' })
    }

    // const costumer = await stripe.costumers.create({
    //   email,
    //   username
    // })

    const costumer = await stripe.costumer.create({
      email,
      username
    })

    console.log('costumer', costumer)

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const NewUser = new user({ username, email, password: passwordHash, stripeCostumerId: costumer.id })
    await NewUser.save()
    console.log('new user', NewUser)

    return res.status(201).send({ message: 'register has been succes', NewUser })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}

// login
exports.Login = async (req, res) => {
  const { email, password } = req.body

  try {
    const userLogin = await user.findOne({ email })
    console.log('check log', userLogin)
    if (!userLogin) {
      return res.status(401).json({ message: 'Invalid credential' })
    }

    const isPasswordValid = await bcrypt.compare(password, userLogin.password)

    if (isPasswordValid) {
      return res.status(401).json({ message: 'password is not match' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' })
    return res.status(200).send({ token, userLogin, message: 'login has been success' })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'internale server error' })
  }
}

// logout
exports.logout = async (req, res) => {
  const { token } = req.body

  try {
    await user.findOneAndDelete({ token })
    return res.status(200).send({ message: 'user already logout' })
  } catch (error) {
    console.log('error', error)
    return res.status(400).send({ message: 'logout is failed' })
  }
}
