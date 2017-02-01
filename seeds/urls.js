exports.seed = function(knex, Promise) {
  return knex('urls').del()
    .then(function () {
      return Promise.all([
        knex('urls').insert({short: 'abc', long: 'http://www.google.com/', user_id: 1}),
        knex('urls').insert({short: 'def', long: 'http://www.duckduckgo.com/', user_id: 1}),
        knex('urls').insert({short: 'ghi', long: 'http://www.bing.com/', user_id: 2}),
        knex('urls').insert({short: 'jkl', long: 'http://www.yahoo.com/', user_id: 2}),
        knex('urls').insert({short: 'mno', long: 'http://www.ask.com/', user_id: 2})
      ]);
    });
}