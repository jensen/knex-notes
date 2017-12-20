const users = [
  { id: 1, email: 'first@user.com', password: '123456' },
  { id: 2, email: 'second@user.com', password: '123456' }
];

const urls = [
  { id: 1, short: 'abc', long: 'http://www.google.com/', user_id: 1} ,
  { id: 2, short: 'def', long: 'http://www.duckduckgo.com/', user_id: 1 },
  { id: 3, short: 'ghi', long: 'http://www.bing.com/', user_id: 2 },
  { id: 4, short: 'jkl', long: 'http://www.yahoo.com/', user_id: 2 },
  { id: 5, short: 'mno', long: 'http://www.ask.com/', user_id: 2 }
];

exports.seed = function(knex, Promise) {
  /* Helper function to seed tables, defined inside of the seed function
     to get access to 'knex'. Closure. */
  const seedTable = (table, data) => {
    /* Need to make sure that our primary key starts after the seeded entries. */
    return knex.raw(`ALTER SEQUENCE ${table}_id_seq RESTART WITH ${data.length + 1}`)
      .then(() => {
        /* Removes all of the current entries for that table. */
        return knex(table).del().then(() => {
      })
      .then(() => {
        /* Insert rows as an array. */
        return knex(table).insert(data);
      })
    })

  };

  return seedTable('users', users).then(() => {
    return seedTable('urls', urls);
  });
};
