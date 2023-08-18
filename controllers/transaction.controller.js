require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Transaction = require('../model/transaction')
const user = require('../model/user')
const fcmNode = require('fcm-node')

exports.transactions = async (req, res) => {
  try {
    const { amount, userId, paymentMethodId } = req.body

    const userTransaction = await user.findOne({ username: userId.username })

    if (userTransaction.balance < amount) {
      res.status(400).send({ message: 'Insuffliction balance' })
    }

    userId.balance -= amount
    await userId.save()

    // payment intent with stripe
    const payemntIntent = await stripe.payemntIntents.create({
      amount,
      currency: 'IDR',
      payment_method: paymentMethodId,
      confirm: true
    })

    const transaction = new Transaction({
      amount,
      userId,
      paymentMethodId,
      status: payemntIntent.status
    })

    // notification send
    const message = {
      to: userId,
      notificationL: {
        title: 'Transfer notification',
        body: `You Received a transfer of $${amount}`
      }
    }

    fcmNode.send(message, (error, response) => {
      if (error) {
        console.error('error sending notification:', error)
      }
    })

    await transaction.save()
    return res.status(200).json({ data: transaction, message: 'transaction has been created' })
  } catch (error) {
    return res.status(500).send({ message: 'internale server error', error: error.message })
  }
}
