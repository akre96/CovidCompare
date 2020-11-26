/**
 * @file SQL query to get all model predictions for a given region and model
 */
import runQuery from '../../../lib/db';
import { SQL } from 'sql-template-strings';
import dayjs from 'dayjs';

export default async function (req, res) {
  const {
    query: { params },
  } = req;
  const [loc, model] = params.splice(0, 2);
  const truth = await runQuery(SQL`
    SELECT
        date,
        truth 
    FROM truth
    WHERE ihme_loc_id = ${loc}
    ORDER BY date
`);
  const dataQuery = SQL`
        SELECT
            forecast.date,
            forecast.mean,
            forecast.model_date,
            truth.truth
        FROM (forecast 
          LEFT JOIN truth
          ON forecast.date = truth.date
          AND forecast.ihme_loc_id = truth.ihme_loc_id)
        WHERE forecast.ihme_loc_id = ${loc}
        AND forecast.model_short = ${model}
        ORDER BY date
    `;
  const data = await runQuery(dataQuery);
  res.status(200).json({ data, truth });
}
