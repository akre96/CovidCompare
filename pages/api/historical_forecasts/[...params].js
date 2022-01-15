/**
 * @file SQL query to get all model predictions for a given region and model
 */
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

export default async function (req, res) {
  const {
    query: { params },
  } = req;
  console.log(params)
  const [loc, model, time] = params.splice(0, 3);

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
        AND YEAR(forecast.model_date) = ${time.split('-')[1]}
        AND MONTH(forecast.model_date) = ${time.split('-')[0]}
        ORDER BY date
    `;
  const data = await runQuery(dataQuery);
  res.status(200).json({ data });
}
