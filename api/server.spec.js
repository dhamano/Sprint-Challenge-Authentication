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
                  expect(typeof res).toBe('object');
                });
    });
  });
})