const data = require('./middleweares/model.js')

const insert = async(userId, array) => {
    let steep = array.join(' ')
    await data(`
        insert into users(user_id, steep) values ($1, $2)
    `,userId,steep)
}

const insertAudio = async(uid,year, link, size, title, info,cat) => {
    await data(`
        insert into audios(audio_id,title,info,link,date,category,size) values ($1, $2, $3, $4, $5, $6, $7)
    `,uid,title, info, link, year, cat, size)
}

const update = async(userId, array) => {
    let steep = array.join(' ')
    await data(`
        update users set steep = $2 where user_id = $1
    `,userId,steep)
}

const select = async() => {
    const users = await data(`
        select 
            *
        from users
    `)
    return users 
}

const selectSet = async() => {
    const set = await data(`
        select 
            *
        from settings
    `)
    return set[0] 
}

const selectAudios = async() => {
    const audios = await data(`
        select 
            *
        from audios
    `)
    return audios 
}

const deleteAudio = async(uid) => {
    await data(`
        DELETE FROM audios
        WHERE audio_id = $1
    `,uid)

}

module.exports = {
    selectAudios,
    insertAudio,
    deleteAudio,
    selectSet,
    update,
    insert,
    select
}