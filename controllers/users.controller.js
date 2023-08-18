/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const user = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const stripe = require('../shared/stripe.js')
const passport = require('../shared/AuthGoogle.js')
const geoip = require('geoip-lite')
const ip = require('ip')
const axios = require('axios')

// findAll
exports.findAll = async (req, res) => {
  const { userId } = req.params

  try {
    const userWithWallet = await user.findById(userId).populate({
      path: 'wallet',
      options: { strictPopulate: false }
    })

    console.log('chekc', userWithWallet)
    return res.send({ message: 'get all data succes', users: userWithWallet })
  } catch (error) {
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

    // const costumer = await stripe.costumer.create({
    //   email,
    //   username
    // })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const NewUser = new user({ username, email, password: passwordHash })
    await NewUser.save()

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
    if (!userLogin) {
      return res.status(401).json({ message: 'Invalid credential' })
    }

    const isPasswordValid = await bcrypt.compare(password, userLogin.password)

    if (isPasswordValid) {
      return res.status(401).json({ message: 'password is not match' })
    }

    // get location with ip
    const ipAddress = ip.address()
    const geoLoc = `http://ipinfo.io/${ipAddress}/json`
    console.log(geoLoc)

    // const location = {
    //   ip: geoLoc.padStart.ip
    // }

    const responseLocation = await axios.get()

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' })
    return res.status(200).send({
      token,
      userLogin,
      // location: geoLoc,
      message: 'login has been success'
    })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'internale server error' })
  }
}

// login with google
exports.loginWithGoogle = async (req, res) => {
  // passport.use(new Googl())
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
}

exports.callBackGoogle = async (req, res) => {
  passport.authenticate('google', { failureRedirect: '/api/v1/login' })
  res.redirect('/')
}

// logout
exports.logout = async (req, res) => {
  const { token } = req.body

  try {
    await user.findOneAndDelete({ token })
    return res.status(200).send({ message: 'user already logout' })
  } catch (error) {
    return res.status(400).send({ message: 'logout is failed' })
  }
}
