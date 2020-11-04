import sqlite3 from 'sqlite3';
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

  // Determine wheter all users are requests or single user
  // Here based on the httpMethod
  // This could also be achieved by checking if the request body is empty or not, if desired
  let query = '';
  if (event.httpMethod == 'OPTIONS') {
    try {
      console.log('Received first_name:', JSON.parse(event.body).first_name);
      query =
        "SELECT * FROM user WHERE first_name='" +
        JSON.parse(event.body).first_name +
        "';";
    } catch (err) {
      console.log('Unable to retreive user due to:\n', err);
    }
  } else {
    query = 'SELECT * FROM user';
  }

  // Execute query on db
  db.all(query, (err: any, data: any) => {
    if (err) {
      console.log('Failed to retreive user(s) from db.', err);
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: err,
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

  db.close();
};
