exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({email: 'first@user.com', password: '123456'}),
        knex('users').insert({email: 'second@user.com', password: '123456'})
      ]);
    });
};