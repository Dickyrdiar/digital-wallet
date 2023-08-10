/* eslint-disable no-undef */
/* eslint-disable n/handle-callback-err */
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const expect = chai.expect

chai.use(chaiHttp)

// login unit test
describe('Authentication', () => {
  describe('POST /api/v1/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/v1/register')
        .send({ username: 'new user', email: 'new@mail.com', password: 'password123' })
        .end((err, res) => {
          try {
            expect(res).to.have.status(201)
            expect(res.body.message).to.equal('user register success')
            done()
          } catch (err) {
            expect(res).to.have.status(500)
            expect(res.body.message).to.equal(err.message)
          }
        })
    })
  })
})
