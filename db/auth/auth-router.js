const router = require('express').Router();
const bcrypt = require('bcryptjs');
const restrict = require('./authenticate-middleware');

const Users = require('../database/dbConfig');
let count = 0;

router.post('/register', async (req, res) => {
  // implement registration
  try {
    const user = req.body;
  
    user.password = gethash(user.password);
  
    const id = await Users('users').insert(user);
    console.log('id',id);
    if(id) {
      res.status(201).json(id);
    } else {
      res.status(400).json({ error: 'something went wrong' });
    }
  }
  catch(err) {
    res.status(500).json({ error: 'something went wrong adding user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // implement login
  try {
    const user = await Users('users').where({ username }).first();
    if(user && bcrypt.compareSync(password, user.password)) {
      req.session.username = user.username;
      req.session.loggedIn = true;
      res.status(200).json({ message: `Welcome ${user.username}`, session: req.session });
    } else {
      res.status(400).json({ error: 'Invalid Credentials' });
    }
  }
  catch(err) {
    res.status(500).json({ error: 'something went wrong logging you in' });
  };
});

router.get('/logout', (req, res) => {
  console.log('logout ' + count);
  count++;
  if(req.session && req.session.loggedIn) {
    req.session.destroy();
    res.status(200).json({ message: 'you have successfully logged out' });
  }
});

router.get('/users', restrict, async (req, res) => {
  const users = await Users('users');
  if(users) {
    res.status(200).json(users);
  } else {
    res.status(500).json({ error: 'there was an error retrieving users' });
  }
})

function gethash(toHash) {
  return bcrypt.hashSync(toHash, 14);
}

module.exports = router;
