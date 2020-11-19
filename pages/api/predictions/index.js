import runQuery from '../../../lib/db'
import {SQL} from 'sql-template-strings'

export default async function(req, res) {
  const cases = await runQuery(SQL`
      SELECT *
      FROM currentforecast 
      LIMIT 10
    `)
  res.status(200).json({ cases })
}
