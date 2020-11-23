/**
 * @file SQL query to get all model predictions for a given region and model
 */
import runQuery from '../../../lib/db';
import { SQL } from 'sql-template-strings';

export default async function (req, res) {
  const {
    query: { params },
  } = req;
  const truth = await runQuery(SQL`
    SELECT
        date,
        truth 
    FROM truth
    WHERE ihme_loc_id = ${params[0]}
    ORDER BY date
`);
  const data = await runQuery(SQL`
        SELECT
            forecast.ihme_loc_id,
            forecast.date,
            forecast.mean,
            forecast.model_date
        FROM forecast
        WHERE forecast.ihme_loc_id = ${params[0]}
        AND forecast.model_short = ${params[1]}
        ORDER BY date
    `);
  res.status(200).json({ data, truth });
}
