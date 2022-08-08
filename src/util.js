const {data,api} = require('./middleweares/model.js')
const  axios = require('axios')

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

const  viweVideos = async(id) => {
    let video = await data(`
        select 
            *
        from videos
        where video_id = $1;
    `,id)
    return video
}

const deleteAudio = async(uid) => {
    await data(`
        DELETE FROM audios
        WHERE audio_id = $1
    `,uid)

}

const deletePlaylist = async(category) => {
    let pId = await data(`
        select 
            play_list 
        from playList
        where category = $1
    `,category)
    if(pId[0].play_list){
        let id = pId[0]?.play_list
        await data(`
            DELETE FROM videos
            WHERE play_list = $1
        `,id)
        await data(`
            DELETE FROM playList
            WHERE category = $1
        `,category)
    }
}

const selectPlaylist = async(category) =>{
    let pId = await data(`
        select 
            *
        from playList
        where category = $1;
    `,category)
    return pId[0]?.play_list
}

const playlist = async(category,playlist) => {
    await data(`
        delete from playList
        where category = $1
    `,category)
    await data(`
        insert into playList(category,play_list) values ($1, $2)
    `,category,playlist)
}

const  vid = async(id) => {
    let video = await data(`
        select 
            *
        from audios
    `)
    // return video
    console.log(video) 
}

// vid()

const yutubeApi = async(playlist, bot) => {
    let count = 0
    let videos = await api(playlist)
    let video = await data(`
        select 
            * 
        from videos 
        where play_list = $1
    `, playlist)
    let arr = await videos.videos.map(async(el, index) => {
        let dat  = video.find(dat_el => dat_el.video_id == el.id)
        if(!dat) {
            let down = await download(el.id, bot)
            // console.log(down);
            await data(`
                insert into videos(video_id, title, imgUrl,play_list,time_length, video_tg_id, video_size) values ($1, $2, $3, $4, $5, $6, $7)
            `,el.id, el.title, el.thumbnail_url,videos.id, el.length, down?.video?.file_id ? down?.video?.file_id : false, down?.video?.file_size ? down?.video?.file_size : 0)
            count++
            return 
        } else if(dat) {
            if(dat.video_tg_id == 'false'){
                let down = await download(el.id, bot)
                await data(`
                    update videos set video_tg_id = $2, video_size = $3 where video_id = $1
                `, dat.video_id, down?.video?.file_id ? down?.video?.file_id : false, down?.video?.file_size ? down?.video?.file_size : 0 )
            }
            return 
        }
        return true
    })
}




const download = async(dat, bot) => {
    if(!dat) return
    try{
        let options = {
            method: 'GET',
            url: 'https://youtube-search-and-download.p.rapidapi.com/video',
            params: {id: `${dat}`},
            headers: {
                'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com',
                'x-rapidapi-key': 'da6e2199f0mshc58303b344eec4ap138ef0jsna1fe1b5ecdc2'
            }
        };
        let res = await axios.request(options)
        let err = await bot.sendVideo('887528138', (res.data.streamingData.formats[1].url));
        return err
    }catch(err){
        console.log(err);
        return false 
    }
} 

module.exports = {
    deletePlaylist,
    selectPlaylist,
    selectAudios,
    selectVideos,
    insertAudio,
    deleteAudio,
    viweVideos,
    selectSet,
    yutubeApi,
    playlist,
    update,
    insert,
    select
}