const { category, date, cancel } = require('../menu.js')
const data = require('../middleweares/model.js')

const send = (bot,msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId).steep.split(' ')?.steep
    bot.sendMessage()
}