var knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'kjensen',
    password : '',
    database : 'w4d2'
  }
});

module.exports = {
  getAllUsers: (done) => {
    knex.select().table('users')
    .then(function(results) {
      done(results);
    });
  },
  getAllUrlsForUser: (user, done) => {
    knex.select().from("urls")
    .where({ user_id: user })
    .then((results) => {
      done(results);
    });
  },
  createUrl: (data, done) => {
    knex.insert({
      short: data.short,
      long: data.long,
      user_id: data.user_id
    })
    .into("urls")
    .then((results) => {
      done(results);
    });
  },
  getUrl: (short, done) => {
    knex.select("short", "long")
    .from("urls")
    .where({ short: short })
    .then((results) => {
      done(results[0]);
    });
  },
  updateUrl: (short, long, done) => {
    knex("urls")
    .where({ short: short })
    .update({ long: long })
    .then((results) => {
      done();
    });
  },
  deleteUrl: (short, done) => {
    knex("urls")
    .where({ short: short })
    .del()
    .then((results) => {
      done();
    });
  }
};