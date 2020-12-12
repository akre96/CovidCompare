// API endpoint to get model predictions for a given region
import { SQL } from 'sql-template-strings';
import runQuery from '../../../lib/db';

async function getForecast(req, res) {
  const {
    query: { params },
  } = req;
  const [region, output] = params.splice(0, 2);
  let forecastTable;
  let truthTable;
  if (output === 'daily') {
    forecastTable = 'currentdaily';
    truthTable = 'truthdaily';
  } else if (output === 'cumulative') {
    forecastTable = 'currentforecast';
    truthTable = 'truth';
  } else {
    throw 'Error: Output variable not supported';
  }
  const truth = await runQuery(
    SQL`
    SELECT
        date,
        truth 
    FROM `
      .append(truthTable)
      .append(
        SQL`
    WHERE ihme_loc_id = ${region}
    ORDER BY date
`,
      ),
  );
  const data = await runQuery(
    SQL`
        SELECT
            ihme_loc_id,
            date,
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
        FROM `
      .append(forecastTable)
      .append(
        SQL`
        WHERE ihme_loc_id = ${region}
        ORDER BY date
    `,
      ),
  );
  res.status(200).json({ data, truth });
}
export default getForecast;
