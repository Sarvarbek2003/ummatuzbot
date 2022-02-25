const {data,api} = require('./middleweares/model.js')

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

const selectVideos = async(category) => {
    const videos = await data(`
        select 
            p.category,
            v.title,
            v.time_length,
            v.video_id,
            v.imgUrl
        from videos as v
        left join playList as p on p.play_list = v.play_list
        where p.category = $1
    `,category)
    return videos 
}

const deleteAudio = async(uid) => {
    await data(`
        DELETE FROM audios
        WHERE audio_id = $1
    `,uid)

}

const selectPlaylist = async(category) =>{
    await data(`
        select 
            *
        from playList
        where category = $1;
    `,category)
}

const playlist = async(category,playlist) => {
    await data(`
        delete from playList
        where category = $2
    `,playlist,category)
    await data(`
        insert into playList(category,play_list) values ($1, $2)
    `,category,playlist)
}

const yutubeApi = async(playlist) => {
    let videos = await api(playlist)
    await data(`
        delete from videos
        where play_list = $1
    `,playlist)
    videos.videos.map(async(el) => {
        await data(`
            insert into videos(video_id, title, imgUrl,play_list,time_length) values ($1, $2, $3, $4, $5)
        `,el.id, el.title, el.thumbnail_url,videos.id, el.length)
    })
    return videos
}

module.exports = {
    selectPlaylist,
    selectAudios,
    selectVideos,
    insertAudio,
    deleteAudio,
    yutubeApi,
    selectSet,
    playlist,
    update,
    insert,
    select
}