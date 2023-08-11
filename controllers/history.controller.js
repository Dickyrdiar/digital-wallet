const transactions = require('../model/transaction')

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
    const transaction = await transactions.find({ userId }).sort({ createdAt: -1 })
    res.status(200).send({ transaction })
  } catch (error) {
    res.status(500).send({ error: error.message, message: 'internal server error' })
  }
}
