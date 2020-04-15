const { Router } = require('express');
const User = require('../models/User');
const chance = require('chance').Chance();
const CC = require('../models/CharacterClass');
const ensureAuth = require('../middleware/ensure-auth');
const express = require('express');
const app = express();
app.use(express.json());

//CREATE
app.post('/class', (req, res) => {
  CC
    .create(req.body)
    .then(CC => {
      res.send(CC);
    });
});

app.post('/class/random', (req, res) => {
  CC.create({
    name: chance.profession(),
    hp: chance.natural({ min: 8, max: 20 }),
    mana: chance.natural({ min: 3, max: 18 }),
    speed: chance.natural({ min: 3, max: 18 }),
    strength: chance.natural({ min: 3, max: 18 }),
    intelligence: chance.natural({ min: 3, max: 18 }),
    agility: chance.natural({ min: 3, max: 18 })
  })
    .then(CC => {
      res.send(CC);
    });
});

//READ
app.get('/class/:id', (req, res) => {
  const id = req.params.id;
  CC.findById(id)
    .then(CC => res.status(200)
      .send(CC));
});

//UPDATE
app.patch('/class/:id', (req, res) => {
  CC
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedItem => {
      res.send(updatedItem);
    });

});

//DELETE
app.delete('/class/:id', (req, res) => {
  CC.findByIdAndDelete(req.params.id)
    .then(deletedItem => {
      res.send(deletedItem);
    });
});

module.exports = app;

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: 24 * 60 * 60 * 1000
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: 24 * 60 * 60 * 1000
        });
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user)
      .catch(next);
  });
