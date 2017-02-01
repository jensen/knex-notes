module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'w4d2',
      user:     'kjensen',
      password: ''
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};