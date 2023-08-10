require('dotenv').config()
const stripe = require('stripe')('sk_test_51NZapmGRyFtO5XHmiJ75DSe5MZoWsAumt3DBBqdZzpveAfupP1Iy1VIy4Jlcmddh0QY2c93DKgLcsGnnuG36Cq4A00XSry0sUm')
module.exports = stripe
