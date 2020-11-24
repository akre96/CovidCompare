// API endpoint to get model predictions for a given region
import runQuery from '../../../lib/db';
import { SQL } from 'sql-template-strings';

export default async function (req, res) {
  const {
    query: { region },
  } = req;
  const truth = await runQuery(SQL`
    SELECT
        date,
        truth 
    FROM truth
    WHERE ihme_loc_id = ${region}
    ORDER BY date
`);
  const data = await runQuery(SQL`
        SELECT
            currentforecast.ihme_loc_id,
            currentforecast.date,
            Delphi,
            IHME_MS_SEIR,
            Imperial,
            LANL,
            SIKJalpha,
            Delphi_u,
            IHME_MS_SEIR_u,
            Imperial_u,
            LANL_u,
            SIKJalpha_u,
            Delphi_l,
            IHME_MS_SEIR_l,
            Imperial_l,
            LANL_l,
            SIKJalpha_l
        FROM currentforecast
        WHERE currentforecast.ihme_loc_id = ${region}
        ORDER BY date
    `);
  res.status(200).json({ data, truth });
}
