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

describe('[POST] /api/auth/register', () => {
  let res;
  const newUser = {username: 'legolas', password: 'thatOnlyCountsAsOne'};
  beforeEach(async () => {
    res = await request(server).post('/api/auth/register')
      .send(newUser);
  });
  it('adds new user into the database', async () => {
    const users = await db('users');
    expect(users).toHaveLength(1);
  });
})