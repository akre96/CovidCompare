// API endpoint to get model predictions for a given region
import runQuery from '../../../lib/db';
import { SQL } from 'sql-template-strings';

export default async function (req, res) {
  const {
    query: { region },
  } = req;
  const data = await runQuery(SQL`
        SELECT
            currentforecast.ihme_loc_id,
            currentforecast.date,
            truth.truth, 
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
        LEFT OUTER JOIN truth 
        ON (truth.date = currentforecast.date
        AND truth.ihme_loc_id = currentforecast.ihme_loc_id)
        WHERE currentforecast.ihme_loc_id = ${region}
    `);
  console.log(data);
  res.status(200).json({ data });
}
