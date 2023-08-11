/* eslint-disable no-useless-catch */
/* eslint-disable no-unreachable */
const Transfers = require('../model/transfer.js')
const user = require('../model/user')
const stripe = require('../shared/stripe.js')

exports.Transfers = async (req, res) => {
  const { receiverUsername, senderUsername, amount } = req.body

  const intiateTransfer = async (receiverAccountId, amount) => {
    try {
      const transfer = await stripe.transfer.create({
        amount,
        currency: 'idr',
        destination: receiverAccountId
      })
      return transfer
    } catch (error) {
      throw error
    }
  }

  try {
    const senderUser = await user.findOne({ username: senderUsername })
    const receiverUser = await user.findOne({ username: receiverUsername })

    if (!senderUser || !receiverUser) {
      return res.status(400).send({ error: 'sender or receiver not found' })
    }

    if (senderUser.balance < amount) {
      res.status(400).send({ message: 'Insufficient balance' })
    }

    senderUser.balance -= amount
    await senderUser.save()

    const transfer = await intiateTransfer(receiverUser.stripeCostumerId, amount)

    const transfers = new Transfers({
      receiver: receiverUser._id,
      sender: senderUser._id,
      amount,
      status: transfer.status
    })
    await transfers.save()
    res.status(201).send({ message: 'transfer has been success', transfers, transfer })
  } catch (error) {
    res.status(500).send({ message: 'invalid server error' })
  }
}

exports.getAllTransfer = async (req, res) => {
  try {
    const transfer = await Transfers.find().populate('sender receiver')
    res.status(200).send({ data: transfer })
  } catch (error) {
    res.status(500).send({ error: 'an error occurred while fetching transfer', data: error })
  }
}
