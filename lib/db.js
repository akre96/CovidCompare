import mysql from 'serverless-mysql'

const db = mysql({  
    config: {    
        host: process.env.MYSQL_HOST,    
        port: process.env.MYSQL_PORT,    
        database: process.env.MYSQL_DATABASE,    
        user: process.env.MYSQL_USER,    
        password: process.env.MYSQL_PASSWORD,
    },
    onConnect: () => {console.log('onConnect')},
    onConnectError: () => {console.log('onConnect Error')}
});

export default async function runQuery(query) {
    const results = await db.query(query)
    await db.end()
    return results
}

