const Wallet = require('../model/wallet')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// get allWallet
exports.getallWallet = async (req, res) => {
  try {
    const getAllData = await Wallet.find()
    return res.status(200).json({ getAllData })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server Error' })
  }
}

// create wallet
exports.newWallet = async (req, res) => {
  const { userId, balance } = req.body
  try {
    const existingWallet = await Wallet.findById({ userId })
    if (!existingWallet) {
      return res.status(400).json({ message: 'wallet already exist' })
    }

    const paymentIntent = await stripe.paymentIntent.create({
      currency: 'idr',
      costumer: existingWallet.stripeCustomerId
    })

    console.log('payment', paymentIntent)

    // create a wallet
    const createWallet = new Wallet({ userId, balance })
    await createWallet.save()
    return res.status(200).json({ data: createWallet, paymentIntent })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message, message: 'Internal server error' })
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

    const costumer = await stripe.costumers.retrieve(wallet.stripeCustomerId)
    const balance = costumer.balace

    return res.status(200).json({ balance })
  } catch (err) {
    console.log(err)
  }
}
