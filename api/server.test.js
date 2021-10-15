const request = require('supertest');

const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('[POST] /api/auth', () => {
  let res;
  const newUser = {username: 'legolas', password: 'thatOnlyCountsAsOne'};
  beforeEach(async () => {
    res = await request(server).post('/api/auth/')
      .send(newUser);
  });
})