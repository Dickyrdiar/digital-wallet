/* eslint-disable no-array-constructor */
const transactions = require('../model/transaction')
const { Transfers } = require('./transfer.controller')

// search history
exports.searchHistory = async (req, res) => {
  try {
    const { q } = req.query
    const searchResult = transactions.find({
      $text: { $search: q.body.query }
    })
    return res.status(200).send({ searchResult })
  } catch (err) {
    res.status(500).send({ error: err })
  }
}

// history transaction
exports.HistortTransaction = async (req, res) => {
  try {
    const { userId } = req.params
    const transfers = await Transfers.find({ userId }).sort({ createdAt: -1 })
    const transaction = await transactions.find({ userId }).sort({ createdAt: -1 })

    const ArrayHistory = new Array(transfers, transaction)

    res.status(200).send({ data: ArrayHistory })
  } catch (error) {
    res.status(500).send({ error: error.message, message: 'internal server error' })
  }
}
