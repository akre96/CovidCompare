// Connect to mySQL database and run queries
import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  },
  onConnect: () => {
    console.log('Connected to SQL Database');
  },
  onConnectError: () => {
    console.log('SQL Connection Error');
  },
});

export default async function runQuery(query) {
  const results = await db.query(query);
  await db.end();
  return results;
}
