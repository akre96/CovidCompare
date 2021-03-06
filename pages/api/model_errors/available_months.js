// API endpoint to get months of model error data available
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

export default async function (_req, res) {
  const data = await runQuery(SQL`
        SELECT DISTINCT model_month FROM errors
    `);
  res.status(200).json({ data });
}
