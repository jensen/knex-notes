module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'w4d2'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};