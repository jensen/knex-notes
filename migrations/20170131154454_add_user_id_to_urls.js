exports.up = function(knex) {
  return knex.schema.table("urls", (table) => {
    table.integer("user_id").unsigned();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
};
exports.down = function(knex) {
  return knex.schema.table("urls", (table) => {
    table.dropColumn("user_id");
  });
};