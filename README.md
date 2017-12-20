# knex

Slides and notes can be found at [https://github.com/jensen/knex-notes/](https://github.com/jensen/knex-notes/).

Vaz has provided an incredible [knex-demo](https://github.com/vaz/knex-demo/) with his notes from a previous cohort.

The [knex documentation](http://knexjs.org/) is a useful resource, as it should continue to be updated as the library continues to grow.

## Why not just use string queries?

* Implementation lock in.
* No migrations.
* Poor security.

### Implementation lock in

There are a lot of different SQL implementations.

* Postgres
* MSSQL
* MySQL
* MariaDB
* SQLite
* Oracle

It is the stated goal of knex to be a SQL query builder that supports multiple database implementations. In practice it is rare that you can ignore the implementation you are using. A lot of the complexity of creating connections is hidden.

### No migrations

Migrations are version control for database **schema**.

We can use this to share the structure of the database between developers. When working on a project with multiple instances of the same db this will help you manage the rapid creation of these instances to suppor the current state of your app.

Say we wanted to create the urls table for TinyApp.

```javascript
exports.up = function (knex) {
  return knex.schema.createTable("urls", (table) => {
    table.increments();
    table.string(‘short’);
    table.string(‘long’);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('urls');
};
```

With that migration available any developer could run `knex migrate:latest` to create the table with those columns.

### Poor security

SQL Injections can be the result of unsantized user input making it's way into SQL queries. With SQL injection attacks someone could drop tables from your database, they could list out the contents of tables that contain private user information. knex helps us by handling the sanitization of user input at the library level. Thanks knex.

## Knex Demo

### Database Connection

There are a few ways that `knex` describes configuration. Similar to `pg` you can use a config object with the information.

```javascript
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    database : 'w4d2'
  }
});
```

You can also use a connection string. This is a string that provides the same information but in a different format.

```javascript
require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});
```

**.env**
```
PG_CONNECTION_STRING=postgres://kjensen:@localhost:5432/w4d2
```

If we were to convert all of the TinyApp routes to use SQL queries instead then they would look something like this:

### GET /login

```javascript
select * from users;
knex.select().from("users");
```

### GET /urls

```javascript
select short, long from urls user_id = 1;
knex.select().from("urls").where({ user_id: 1});
```

### POST /urls

```javascript
insert into urls ("short", "long", "user_id") values ("abc", "http://www.lighthouselabs.ca/", 1);
knex.insert({ short: "abc", long: "http://www.lighthouselabs.ca/", user_id: 1 }).into("urls");
```

### GET /urls/:short

```javascript
select short, long from urls where short = "abc";
knex.select("short", "long").from("urls").where({ short: "abc" });
```

### POST /urls/:short/edit

```javascript
update urls set long="http://www.lighthouselabs.ca/" where short = "abc";
knex("urls").where({ short: "abc" }).update({ long: "http://www.lighthouselabs.ca/" });
```

### POST /urls/:short/delete

```javascript
delete from urls where short = "abc";
knex("urls").where({ short: "abc" }).del();
```

### Getting the results

Above were all calls that could generate queries, but none of them actually made the queries we defined. For that we need to use a callback or Promise. You will be more familiar with callbacks at this point, but if you feel like you want a challenge, get used to using Promises.

**As a callback**

```javascript
knex.select().from("users").asCallback((error, results) => {
  // handle error
  results.forEach((result) => {
    console.log(result.email);
  });
});
```

**As a Promise**

```javascript
knex.select().from("users").then((results) => {
  results.forEach((result) => {
    console.log(result.email);
  });
}).catch((error) => {
  // handle error
});
```

### Migrations

Before we create any migrations we need to initialize our `knexfile.js` configuration file. We can do this by running the knex command line tool `knex init`. You can configure it for the different environments you may have. The default `knexfile.js` has a development, staging and production configuration. In this exercise we will only use a development config.

```javascript
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
```

In order to setup migrations we need to need to run the `knex migrate:make <name>` command.

We can call `knex --env production migrate:latest` if we want to specify which environment (from our knexfile) to use when applying the latest migrtion.

There were about four stages in TinyApp where the database schema had to change. Here are the four migrations that correspond.

Create urls table with id, short and long url.

**20161120201923_create_urls_table.js**

```javascript
exports.up = function(knex) {
  return knex.schema.createTable("urls", (table) => {
    table.increments();
    table.string("short");
    table.string("long");
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable("urls");
}
```

Create users table with id and username.

**20161120202940_create_users_table.js**

```javascript
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username");
  })
};
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
```

Add email and password, but remove the username for users.

**20161120203540_add_email_password_to_users.js**

```javascript
exports.up = function(knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("username");
    table.string("email");
    table.string("password");
  });
};
exports.down = function(knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumns("email", "password");
    table.string("username");
  });
};
```

Add user_id to urls table so that users can have many urls.

**20161120204226_add_user_id_to_urls.js**

```javascript
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
```

### Rules for migrations

**Do not modify a migration once it has been made available to another developer.**

Here is an example problem scenario where there are two developers working on project together.

* Developer A creates a new table as a migration. They run `knex migrate:latest` and now have the most up to date db.
* Developer A commits the migration to git.
* Developer B retrieves the latest version from git and runs `knex migrate:latest`, they now have the same schema as Developer A.
* Developer A needs to add a new column to their db. They change the migration that exists. In order for them to apply the change they have to run `knex migrate:rollback` and then `knex migrate:latest`.
* Developer A commits the updated migration to git.
* Developer B retrives the latest version from git and runs `knex migrate:latest`, no change is made. They have already applied the migration. They now have a different db than Developer A.

In order for this to work, Developer A would have had to instruct Developer B to rollback and remigrate. This is bad workflow. What if there are 30 developers on your team?

**We can and should create a new migration for every change to the db.**

## Seeds

When you run `knex seed:make <name>` you will create a template file in the seeds directory. I for most projects I tend to create a single `seeds.js` file. This way I can easily control the order in which the entries are added to the database.

> `knex seed:make seeds` would produce a file with a basic template. I prefer the approach that I've provided example source code for.

**seeds.js**

```javascript
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

```

In order to seed the database you would run `knex seed:run`.

## Bonus

I wanted to include information on how to run local node_modules like `knex`. This section can be skipped if you just want to run node modules globally.

**package.json**

```javascript
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "knex": "./node_modules/.bin/knex"
}
```

Inside package.json I created a new 'script' called knex. This can be run as `npm run knex`.

**ls -la node_modules/.bin/**

```
drwxr-xr-x    8 kjensen  staff   272 22 Nov 19:41 .
drwxr-xr-x  139 kjensen  staff  4726 22 Nov 19:41 ..
lrwxr-xr-x    1 kjensen  staff    18 22 Nov 19:41 knex -> ../knex/bin/cli.js
lrwxr-xr-x    1 kjensen  staff    14 22 Nov 19:41 mime -> ../mime/cli.js
lrwxr-xr-x    1 kjensen  staff    20 22 Nov 19:41 mkdirp -> ../mkdirp/bin/cmd.js
lrwxr-xr-x    1 kjensen  staff    19 22 Nov 19:41 user-home -> ../user-home/cli.js
lrwxr-xr-x    1 kjensen  staff    21 22 Nov 19:41 uuid -> ../node-uuid/bin/uuid
lrwxr-xr-x    1 kjensen  staff    18 22 Nov 19:41 which -> ../which/bin/which
```

These are the command line interfaces for the packages that I used for TinyApp. If you are interested in how the cli for knex is implemented you could look at the file `node_modules/knex/bin/cli.js` there might be some familiar stuff in there like `process.argv.slice(2);`.
