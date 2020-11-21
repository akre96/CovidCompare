import runQuery from '../../../lib/db'
import {SQL} from 'sql-template-strings'


export default async function(_req, res) {
    const data = await runQuery(SQL`
        SELECT DISTINCT model_month FROM errors
    `)
    res.status(200).json({ data })
}
