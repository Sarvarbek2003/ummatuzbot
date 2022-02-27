const pg = require('pg')
const ytfps = require('ytfps')

const pool = new pg.Pool({
    host: 'john.db.elephantsql.com',
    port:5432,
    user: 'tgyuzuha',
    password: '4flJWBE8RhabT51dWxq3BqUmjD4Hj-SK',
    database: 'tgyuzuha'
})

const data =  async(query, ...params) => {
    
        const client = await pool.connect()
        try {
            const { rows } = await client.query(query, params.length ? params : null)
            return rows
        } catch(error){
            console.log('database error: ',error)
        } finally {
            client.release()
        }
}

const api = async(play_list) => {
    let res = await ytfps(play_list)
    return res
}

module.exports = {
    data,
    api
}