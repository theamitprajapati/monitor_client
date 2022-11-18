const promise = require('bluebird');

// Initialization Options
const options = {
  promiseLib: promise
};



const pgp = require('pg-promise')(options);

const connectionString = {
  host: 'localhost',
  password: 'admin',
  user: 'amit',
  database: 'GATE_DB',
  port: 5432,
  poolSize: 50,
  poolIdleTimeout: 10000
}

const db = pgp(connectionString);

module.exports = {
  pgp: pgp,
  db: db
};