/**
 * @file SQL query to get truth data
 */
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

export default async function (req, res) {
  const { loc } = req.query
  const truth = await runQuery(SQL`
    SELECT
        date,
        truth 
    FROM truth
    WHERE ihme_loc_id = ${loc}
    ORDER BY date
`);
  res.status(200).json({ truth });
}
