const TelegramBot = require('node-telegram-bot-api');

const token = '2087414787:AAFiAAve3C-KbXfzDCRtv5akPVDsH6wQhFE';

const bot = new TelegramBot(token, {polling: true});

const data = require('./middleweares/model.js')
const audiosMenu = require('./menus/audios.js')
const videosMenu = require('./menus/videos.js')

const { home, date ,category } = require('./menu.js')


bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    if(text == '/start'){
        let userId = (await select()).find(user => user.user_id == chatId)
        if (!userId) await insert(chatId, ['home'])
        else update(chatId, ['home'])
        bot.sendMessage(chatId, 'Ассаломуалекум',{
            reply_markup: home
        })
    }
    else if(text == '🔙 Ортга'){
        if (steep.length == 1) return
        steep.splice(-1, 1)
        await update(chatId, steep)
        menu(steep[steep.length - 1], chatId)
    }
    else if(steep[0] == 'home'){
        if (text == '🎙 Аудио марузалар' || steep[1] == 'audiomenu'){
            audiosMenu.send(bot,msg)
        }
        else if(text == '🎥 Видео марузалар' || steep[1] == 'videomenu'){

        }
    }
});

const select = async() => {
    const users = await data(`
        select 
            *
        from users
    `)
    return users 
}

const insert = async(userId, array) => {
    let steep = array.join(' ')
    await data(`
        insert into users(user_id, steep) values ($1, $2)
    `,userId,steep)
}

const update = async(userId, array) => {
    let steep = array.join(' ')
    await data(`
        update users set steep = $2 where user_id = $1
    `,userId,steep)
}

const menu = (steep,chatId) => {
    if (steep == 'juma'){
        bot.sendMessage(chatId, 'Жума марузалари, йилни танланг 👇',{
            reply_markup:date
        })
    }
    else if (steep == 'maruza'){
        bot.sendMessage(chatId, 'Марузалар топлами, йилни танланг 👇',{
            reply_markup:date
        })
    }
    else if (steep == 'audiomenu'){
        bot.sendMessage(chatId, 'Аудио марузалар',{
            reply_markup:category
        })
    }
    else if (steep == 'home'){
        bot.sendMessage(chatId, 'Бош саҳифа',{
            reply_markup:home
        })
    }
}