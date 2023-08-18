/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-labels */
/* eslint-disable no-unused-expressions */

const { isValidObjectId } = require('mongoose')
const user = require('../model/user')
const Wallet = require('../model/wallet')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// get allWallet
exports.getallWallet = async (req, res) => {
  const { userId } = req.params.userId

  try {
    const WalletUsers = await Wallet.find().populate({
      path: 'user',
      options: { strictPopulate: false }
    })

    const userWallet = await user.find(userId).select('username email')
    console.log('check wallet', WalletUsers, userWallet)

    // const getAllData = await user.find().populate('User')
    return res.status(200).json({ message: 'get data is succes', data: { WalletUsers, userWallet } })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server Error', error: err.message })
  }
}

// create wallet
exports.newWallet = async (req, res) => {
  const { balance } = req.body
  const { userId } = req.params.userId
  try {
    const existingWallet = await user.findById(userId)
    if (existingWallet) {
      return res.status(400).json({ message: 'wallet already exist' })
    }

    if (isValidObjectId(userId)) return Error({ status: 422 })

    // const paymentIntent = await stripe.paymentIntent.create({
    //   currency: 'idr',
    //   costumer: existingWallet.stripeCustomerId
    // })

    // create a wallet
    const createWallet = new Wallet({ userId, balance })
    await createWallet.save()
    return res.status(200).json({ data: createWallet })
  } catch (err) {
    return res.status(500).json({ error: err.message, message: 'Internal server error' })
  }
}

// create topup
exports.createTopup = async (req, res) => {
  const { balance } = req.body
  const { userId } = req.params.userId

  try {
    const users = await user.find({ userId }).select('username email')
    console.log('check user', users)

    if (!user) {
      return res.status(404).send({ error: 'user not found' })
    }

    const wallets = await Wallet.findOne({ user: userId })
    console.log('wallet', wallets)

    if (!wallets) {
      wallets = new Wallet({ user: userId })
    }

    wallets.balance += balance
    await wallets.save()

    return res.status(200).send({ message: 'top up is sucess', data: { wallets, user: users } })
  } catch (error) {
    console.log(error)
  }
}

// get Balance
exports.getBallance = async (req, res) => {
  const { userId } = req.params.userId

  try {
    const wallet = await user.findOne(userId)
    console.log('check wallet', wallet)
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not Found' })
    }

    // const costumer = await stripe.costumers.retrieve(wallet.stripeCustomerId)
    const balance = wallet.balance

    return res.status(200).json({ balance })
  } catch (err) {
    res.status(500).send({ message: 'internal server error', error: err.message })
  }
}
