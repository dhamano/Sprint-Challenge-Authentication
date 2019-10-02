const request = require('supertest');

const db = require('../database/dbConfig');

const server = require('./server');

describe('users database', () => {
  it('tests if DB_ENV is "testing" for tests', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('GET /', () => {
    it('returns 200 ok', () => {
      return request(server).get('/')
                .then( res => {
                  expect(res.status).toBe(200);
                });
    });
    it('returns and object ok', () => {
      return request(server).get('/')
                .then( res => {
                  expect(typeof res).toBe('object');
                });
    });
  });

  describe('POSTs', () => {
    beforeEach( async() => {
      await db('users').truncate();
    });

    describe('POST /register', () => {
      it('returns 201 CREATED', async () => {
        const res = await request(server)
                .post('/api/auth/register')
                .send({ username: "dillon", password: "hello" });
        expect(res.status).toBe(201);
      })
      it('adds to database', async () => {
        await request(server)
                  .post('/api/auth/register')
                  .send({ username: "dillon", password: "hello" });
        const users = await db('users');
        expect(users).toHaveLength(1);
      });
    });

    describe('POST /login', () => {
      it('returns 200 created', async () => {
        await request(server)
                  .post('/api/auth/register')
                  .send({ username: "dillon", password: "hello" });
        const res = await request(server)
                  .post('/api/auth/login')
                  .send({ username: "dillon", password: "hello" });
        expect(res.status).toBe(200);
      });
      it('returns an object', async () => {
        await request(server)
                  .post('/api/auth/register')
                  .send({ username: "dillon", password: "hello" });
        const res = await request(server)
                  .post('/api/auth/login')
                  .send({ username: "dillon", password: "hello" });
        expect(typeof res).toBe('object');
      })
    });
  });
});