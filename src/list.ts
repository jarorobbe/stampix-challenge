import sqlite3 from 'sqlite3';
import * as path from 'path';

// Handler for list lambda function
exports.handler = (event: any, context: any, callback: any) => {
  // Open database connection
  const filePath = path.join(__dirname, '../src/db.sqlite');
  const db = new sqlite3.Database(filePath);

  // Determine wheter all users are requests or single user
  // Here based on the httpMethod
  // This could also be achieved by checking if the request body is empty or not, if desired
  if (event.httpMethod == 'OPTIONS') {
    try {
      const first_name = JSON.parse(event.body).first_name;
      const query = 'SELECT * FROM user WHERE first_name = ?;';
      console.log('Received first_name:', first_name);

      db.all(query, first_name, (err: any, data: any) => {
        if (err) {
          console.log('Failed to retreive user(s) from db.', err);
          callback(null, {
            statusCode: 400,
            body: JSON.stringify({
              message: 'Unable to retreive user(s)',
            }),
          });
        } else {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              users: data,
            }),
          });
        }
      });
    } catch (err) {
      console.log('Unable to retreive user due to:\n', err);
    }
  } else if (event.httpMethod == 'GET') {
    const query = 'SELECT * FROM user';
    // Execute query on db
    db.all(query, (err: any, data: any) => {
      if (err) {
        console.log('Failed to retreive user(s) from db.', err);
        callback(null, {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Unable to retreive user(s)',
          }),
        });
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            users: data,
          }),
        });
      }
    });
  } else {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request denied',
      }),
    });
  }

  db.close();
};
