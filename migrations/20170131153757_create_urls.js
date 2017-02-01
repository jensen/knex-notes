exports.up = function(knex) {
  return knex.schema.createTable("urls", (table) => {
    table.increments();
    table.string("short");
    table.string("long");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("urls");  
};
