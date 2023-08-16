/* eslint-disable no-unused-vars */
const { isValidObjectId } = require('mongoose')
// const user = require('../model/user')
const Wallet = require('../model/wallet')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// get allWallet
exports.getallWallet = async (req, res) => {
  const { userId } = req.params.userId

  try {
    const WalletUsers = await Wallet.findOne({ user: userId }).populate(['userId'])
    console.log('check wallet', WalletUsers)

    // const getAllData = await user.find().populate('User')
    return res.status(200).json({ message: 'get data is succes', data: WalletUsers })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server Error', error: err.message })
  }
}

// create wallet
exports.newWallet = async (req, res) => {
  const { balance, userId } = req.body
  // const { userId } = req.params.userId
  try {
    const existingWallet = await Wallet.findById({ userId })
    if (!existingWallet) {
      return res.status(400).json({ message: 'wallet already exist' })
    }

    if (!isValidObjectId(userId)) return Error({ status: 422 })

    // prototype fixed
    const createWallets = await Wallet.findOneAndUpdate(
      {
        user: userId
      },
      { $set: { balance } },
      { new: true }
    )

    console.log('check new wallets', existingWallet)

    // const paymentIntent = await stripe.paymentIntent.create({
    //   currency: 'idr',
    //   costumer: existingWallet.stripeCustomerId
    // })

    // create a wallet
    const createWallet = new Wallet({ createWallets })
    await createWallet.save()
    return res.status(200).json({ data: createWallet })
  } catch (err) {
    return res.status(500).json({ error: err.message, message: 'Internal server error' })
  }
}

// create topup
exports.createTopup = async (req, res) => {
  const { balance, userId } = req.body

  if (!userId || !balance) {
    return res.status(400).send({ error: 'userId and balance is required' })
  }

  try {
    const userWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance } },
      { new: true }
    )

    if (userWallet) {
      return res.status(400).send({ error: 'wallet is not found' })
    }
    console.log('check user wallet', userWallet)

    res.json(userWallet)
  } catch (error) {
    console.log(error.message)
  }
}

// get Balance
exports.getBallance = async (req, res) => {
  const { userId } = req.params

  try {
    const wallet = await Wallet.findOne({ userId })
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
