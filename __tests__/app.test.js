require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const CC = require('./models/CharacterClass');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can signup a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('can login a user', async () => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('can verify that a user is logged in', async () => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('fails when a bad email is used', async () => {
    await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'no@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });

  it('fails when a bad password is used', async () => {
    await User.create({ email: 'test@test.com', password: 'password' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'pass' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });
});



describe('application routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('has a POST route to add a character class to the db', () =>
    request(app).post('/class')
      .send({
        'name': 'Warrior',
        'hp': '50',
        'mana': '50',
        'speed': '10',
        'strength': '15',
        'intelligence': '20',
        'agility': '5'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          'name': 'Warrior',
          'hp': 50,
          'mana': 50,
          'speed': 10,
          'strength': 15,
          'intelligence': 20,
          'agility': 5,
          __v: 0
        });
      })
  );

  it('has a POST route to add a random character class to the db', () =>
    request(app).post('/class/random')
      .send({})
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          'name': expect.any(String),
          'hp': expect.any(Number),
          'mana': expect.any(Number),
          'speed': expect.any(Number),
          'strength': expect.any(Number),
          'intelligence': expect.any(Number),
          'agility': expect.any(Number),
          __v: 0
        });
      })
  );

  it('has a GET route to get a character from the db', async () => {
    const hero = await CC.create({
      name: 'Jester',
      hp: 40,
      mana: 0,
      speed: 4,
      strength: 18,
      intelligence: 8,
      agility: 12,
    });
    return request(app)
      .get(`/class/${hero._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: hero._id.toString(),
          'name': 'Jester',
          'hp': 40,
          'mana': 0,
          'speed': 4,
          'strength': 18,
          'intelligence': 8,
          'agility': 12,
          __v: hero.__v
        });
      });
  });

  it('gets all notes on GET', async () => {
    const heroes = await CC.create([
      {
        'name': 'Jester',
        'hp': 40,
        'mana': 0,
        'speed': 4,
        'strength': 18,
        'intelligence': 8,
        'agility': 12
      },
      {
        'name': 'Valkyrie',
        'hp': 50,
        'mana': 50,
        'speed': 10,
        'strength': 15,
        'intelligence': 20,
        'agility': 5,
      },
      {
        'name': 'Warrior',
        'hp': '50',
        'mana': '50',
        'speed': '10',
        'strength': '15',
        'intelligence': '20',
        'agility': '5'
      }
    ]);
    return request(app)
      .get('/notes')
      .then(res => {
        heroes.forEach(hero => {
          expect(res.body).toContainEqual({
            _id: hero._id.toString(),
            hp: hero.hp,
            mana: hero.mana,
            speed: hero.speed,
            strength: hero.strength,
            intelligence: hero.intelligence,
            agility: hero.agility,
            __v: hero.__v
          });
        });
      });
  });

  it('should create a new post', () => {
    return request(app)
      .post('/class')
      .send({
        name: 'Valkyrie',
        hp: 50,
        mana: 50,
        speed: 10,
        strength: 15,
        intelligence: 20,
        agility: 5,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          'name': 'Valkyrie',
          'hp': 50,
          'mana': 50,
          'speed': 10,
          'strength': 15,
          'intelligence': 20,
          'agility': 5,
          __v: 0
        });
        expect(res.statusCode).toEqual(200);
      });
  });

  it('has a PATCH route to update a character class in the db', async () => {

    const hero = await CC.create({
      'name': 'Valkyrie',
      'hp': '40',
      'mana': '0',
      'speed': '4',
      'strength': '18',
      'intelligence': '8',
      'agility': '12'
    });
    return request(app)
      .patch(`/class/${hero._id}`)
      .send({ 'name': 'Jester' })
      .then(res => {
        expect(res.body).toEqual({
          _id: hero._id.toString(),
          'name': 'Jester',
          'hp': 40,
          'mana': 0,
          'speed': 4,
          'strength': 18,
          'intelligence': 8,
          'agility': 12,
          __v: hero.__v
        });
      });
  });

  it('has a DELETE route to delete a character class from the db', async () => {
    const hero = await CC.create({
      'name': 'Warrior',
      'hp': '50',
      'mana': '50',
      'speed': '10',
      'strength': '15',
      'intelligence': '20',
      'agility': '5'
    });
    return request(app)
      .delete(`/class/${hero._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: hero._id.toString(),
          'name': 'Warrior',
          'hp': 50,
          'mana': 50,
          'speed': 10,
          'strength': 15,
          'intelligence': 20,
          'agility': 5,
          __v: hero.__v
        });
      });
  });
});
