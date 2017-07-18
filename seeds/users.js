exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'first@user.com', password: '123456'}),
        knex('users').insert({id: 2, email: 'second@user.com', password: '123456'})
      ]);
    });
};