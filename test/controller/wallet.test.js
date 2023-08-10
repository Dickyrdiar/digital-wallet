/* eslint-disable no-undef */
const { default: mongoose } = require('mongoose')
const { request } = require('supertest')
const app = require('../../controllers/wallet.controller.js')

// connecting database
beforeEach(async () => {
  await mongoose.connect()
})

describe('GET /api/v1/wallets', () => {
  it('should return all wallets', async () => {
    const res = await request(app).get('/api/v1/wallets')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBeGreatherThan(0)
  })
})
