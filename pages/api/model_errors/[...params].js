// API endpoint to get model error data
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

export default async function (req, res) {
  const {
    query: { params },
  } = req;
  const data = await runQuery(SQL`
    SELECT
        model_short,
        super_region,
        errwk,
        value
    FROM errors
    WHERE
        model_month = ${params[0]}
        AND err_type = ${params[1]}
        AND variable = ${params[2]}
        AND approach = 'monthly'
    `);
  res.status(200).json({ data });
}
