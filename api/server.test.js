const request = require('supertest');

const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true);
});

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('[POST] /api/auth/register', () => {
  const newUser = {username: 'gimli', password: 'thatOnlyCountsAsOne'};
  beforeEach(async () => {
    await request(server).post('/api/auth/register')
      .send(newUser);
  });
  it('adds new user into the database', async () => {
    const users = await db('users');
    expect(users).toHaveLength(1);
  });
  it('proper error response on lacking credentials', async () => {
    const lacking = await request(server).post('/api/auth/register')
      .send({});
    expect(lacking.body).toMatchObject({
      message: 'username and password required'
    });
  });
  it('proper error response if username is taken', async () => {
    const taken = await request(server).post('/api/auth/register')
      .send({username: 'gimli', password: 'andMyAxe'});
    expect(taken.body).toMatchObject({
      message: 'username taken'
    });
  });
});

describe('[POST] /api/auth/login', () => {
  beforeEach(async () => {
    await db('users').insert({
      "username": "gimli",
      "password": "$2a$06$yTCC.Dzh0ekAn4esaE68F.bTHPZrtx64Ptpy/6ksDQvsO7fy.PrA."
  });
  });
  it('can successfully login user', async () => {
    const loggedIn = await request(server).post('/api/auth/login')
      .send({username: 'gimli', password: 'andMyAxe'});
    expect(loggedIn.body.message).toBe('welcome, gimli');
    expect(loggedIn.body.token).toBeTruthy();
  });
  it('proper error response on lacking credentials', async () => {
    const loggedIn = await request(server).post('/api/auth/login')
      .send({});
    expect(loggedIn.body).toMatchObject({
      message: 'username and password required'
    });
  });
});