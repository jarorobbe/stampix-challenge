const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const faker = require('faker');

const dbFile = path.join(__dirname, '../src/db.sqlite');
if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
}
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`
  create table user
  (
    gender text not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone_number text null,
    date_of_birth text not null,
    language text default 'en' not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp default CURRENT_TIMESTAMP not null
  );
  `);

  const stmt = db.prepare(
    'INSERT INTO user (gender, first_name, last_name, email, phone_number, date_of_birth, language) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (let i = 0; i < 50; i++) {
    stmt.each(
      faker.random.arrayElement(['male', 'female', 'other']),
      faker.name.firstName(),
      faker.name.lastName(),
      faker.internet.email(),
      faker.phone.phoneNumber(),
      faker.date.past(),
      faker.random.arrayElement(['en', 'nl', 'fr'])
    );
  }
  stmt.finalize();
});

db.close();
