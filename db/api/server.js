const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const knexConnection = require('../database/dbConfig');

const server = express();

const sessionOptions = {
  name: 'sprinting',
  secret: process.env.COOKIE_SECRET || "Loose lips sink ships!",
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: process.env.COOKIE_SAVEUNITI || true,
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: 'api is running', session: req.session });
})

module.exports = server;
