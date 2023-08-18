module.exports = (app) => {
  const users = require('../controllers/users.controller.js')
  const wallets = require('../controllers/wallet.controller.js')
  const historys = require('../controllers/history.controller.js')
  const transactions = require('../controllers/transaction.controller.js')
  const transfers = require('../controllers/transfer.controller.js')

  // verify from middleware
  const { verifyToken } = require('../middleware/JwtFerivication.js')
  // const protectedUser = require('./protectecRouter.js')

  // users controller
  app.get('/api/v1/:userId/users', verifyToken, users.findAll)
  app.post('/api/v1/register', users.SigupUsers)
  app.post('/api/v1/login', users.Login)
  app.post('/api/v1/logout', users.logout)
  app.get('/api/v1/authGoogle', users.loginWithGoogle)
  app.post('/api/v1/logout', users.logout)

  // wallet constroller
  app.get('/api/v1/:userId/wallets', verifyToken, wallets.getallWallet)
  app.post('/api/v1/:userId/wallets', verifyToken, wallets.newWallet)
  app.get('/api/v1/wallets/:userId', verifyToken, wallets.getBallance)
  app.put('/api/v1/:userId/topupWallet', verifyToken, wallets.createTopup)

  // wallet transaction
  app.post('/api/v1/transaction', verifyToken, transactions.transactions)
  app.get('/api/v1/history/:id', verifyToken, historys.HistortTransaction)
  app.post('/api/v1/search', verifyToken, historys.searchHistory)

  // wallet transfer
  app.post('/api/v1/transfers', verifyToken, transfers.Transfers)
  app.get('/api/v1/transfers', verifyToken, transfers.getAllTransfer)

  // protected
  // app.get('/protected', verifyToken, (req, res) => {
  //   const userId = req.userId
  //   res.json({ message: 'protected contend', userId })
  // })
}
