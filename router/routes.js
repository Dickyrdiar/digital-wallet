module.exports = (app) => {
  const users = require('../controllers/users.controller.js')
  const wallets = require('../controllers/wallet.controller.js')
  const historys = require('../controllers/history.controller.js')
  const transactions = require('../controllers/transaction.controller.js')

  // verify from middleware
  const { verifyToken } = require('../middleware/JwtFerivication.js')

  // users controller
  app.get('/api/v1/users', verifyToken, users.findAll)
  app.post('/api/v1/register', users.SigupUsers)
  app.post('/api/v1/login', users.Login)
  app.post('/api/v1/logout', users.logout)

  // wallet constroller
  app.get('/api/v1/wallets', verifyToken, wallets.getallWallet)
  app.post('/api/v1/wallets', verifyToken, wallets.newWallet)
  app.get('/api/wallets/:userId', verifyToken, wallets.getBallance)

  // wallet transaction
  app.post('/api/v1/transaction', verifyToken, transactions.transactions)

  // history transaction
  app.get('/api/v1/history/:id', verifyToken, historys.HistortTransaction)
  app.post('/api/v1/search', verifyToken, historys.searchHistory)
}
