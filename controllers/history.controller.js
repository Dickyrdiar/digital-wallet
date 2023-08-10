const transactions = require('../model/transaction')

// search history
exports.searchHistory = async (req, res) => {
  transactions.find({ $text: { $search: req.body.query } })
    .then(result => {
      console.log(result)
      res.status(200).json({
        result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
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
