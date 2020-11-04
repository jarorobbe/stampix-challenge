import * as sqlite3 from 'sqlite3';
import * as path from 'path';

exports.handler = (event: any, context: any, callback: any) => {
  // Open database connection
  const filePath = path.join(__dirname, '../src/db.sqlite');
  const db = new sqlite3.Database(filePath, (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Database succesfully opened!');
    }
  });

  const query =
    'INSERT INTO user (gender, first_name, last_name, email, phone_number, date_of_birth, language) VALUES (?, ?, ?, ?, ?, ?, ?)';

  if (event.httpMethod == 'POST' || event.httpMethod == 'OPTIONS') {
    // Add the new user to the database by reading the request body
    try {
      const body = JSON.parse(event.body);
      const statement = db.prepare(query);
      statement.run(
        body.gender,
        body.first_name,
        body.last_name,
        body.email,
        body.phone_number,
        body.date_of_birth,
        body.language
      );
      statement.finalize();
      callback(null, {
        statusCode: 200,
        message: 'User successfully added!',
      });
    } catch (err) {
      console.log(err);
      callback(null, {
        statusCode: 400,
        message: err,
      });
    }
  } else {
    // Requests methods != OPTIONS/POST are not allowed
    callback(null, {
      statusCode: 400,
      message: 'Request denied.',
    });
  }

  db.close();
};
