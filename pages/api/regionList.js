// API endpoint to get regions with forecast data
import { SQL } from 'sql-template-strings';
import runQuery from '../../lib/db';

export default async function (_req, res) {
  const data = await runQuery(SQL`
        SELECT DISTINCT ihme_loc_id, location_name FROM locs
    `);
  res.status(200).json({ data });
}
