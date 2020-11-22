// API endpoint to get model error data
import runQuery from '../../../lib/db';
import { SQL } from 'sql-template-strings';

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
        AND model_short IN (
            'Delphi',
            'IHME_MS_SEIR',
            'LANL',
            'Imperial',
            'SIKJalpha'
        )
        AND approach = 'monthly'
    `);
  res.status(200).json({ data });
}
