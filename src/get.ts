import sqlite3 from 'sqlite3';
import * as path from 'path';

exports.handler = (event: any, context: any, callback: any) => {
  // Open database connection
  const filePath = path.join(__dirname, '../src/db.sqlite');
  const db = new sqlite3.Database(filePath);

  const id = event.pathParameters.id;

  if (event.httpMethod == 'OPTIONS' || event.httpMethod == 'GET') {
    console.log('Received id: ', event.pathParameters.id);
    const query = 'SELECT * FROM user WHERE id=' + id + ';';

    // Execute query on db
    db.all(query, (err: any, data: any) => {
      if (err) {
        console.log('Failed to retreive user from db.', err);
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
  } else {
    callback(null, {
      statusCode: 400,
    });
  }

  db.close();
};
