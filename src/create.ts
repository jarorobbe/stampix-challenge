import * as sqlite3 from 'sqlite3';
import * as path from 'path';

// Handler for callback/create lambda function
exports.handler = async (event: any, context: any, callback: any) => {
  // Open database connection
  const filePath = path.join(__dirname, '../src/db.sqlite');
  const db = new sqlite3.Database(filePath);

  const query =
    'INSERT INTO user (gender, first_name, last_name, email, phone_number, date_of_birth, language) VALUES (?, ?, ?, ?, ?, ?, ?)';

  if (event.httpMethod == 'POST' || event.httpMethod == 'OPTIONS') {
    // Add the new user to the database by reading the request body

    try {
      const body = JSON.parse(event.body);
      const user = [
        body.gender,
        body.first_name,
        body.last_name,
        body.email,
        body.phone_number,
        body.date_of_birth,
        body.language,
      ];
      await db.run(query, user);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ message: 'User added' }),
      });
    } catch (err) {
      console.log(err);
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: err,
        }),
      });
    }
  } else {
    // Requests methods != OPTIONS/POST are not allowed
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request denied',
      }),
    });
  }

  db.close();
};
