// API endpoint to get month of  most recent model
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

export default async function (_req, res) {
  const data = await runQuery(SQL`
        SELECT DISTINCT model_date, model_short FROM current
    `);
  res.status(200).json({ data });
}
