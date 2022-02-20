const date = {
    resize_keyboard: true,
    keyboard:[
        [{text: "2016"},{text: "2017"},{text: "2018"}],
        [{text: "2019"},{text: "2020"},{text: "2021"}],
        [{text: "2022"}],
        [{text: "🔙 Ортга"}]
    ]
}

const category = {
    resize_keyboard: true,
    keyboard:[
        [{text: "🕋 Жума марузалари"},{text: "🎙 Қисқа марузалар"}],
        [{text: "📖 Илмий суҳбат"},{text: "🗂 Фойдали дарслар"}],
        [{text: "🔙 Ортга"}]
    ]
}
const cancel = {
    resize_keyboard: true,
    keyboard:[
        [{text: "🔙 Ортга"}]
    ]
}

const home = { 
    resize_keyboard: true,
    keyboard: [
        [{text: "🎙 Аудио марузалар"},{text:"🎥 Видео марузалар"}]
        // [{text: "⁉️ Савол-жавоб"},{text:"❓ Савол бериш"}]
    ]
}

module.exports = {
    category,
    cancel,
    home,
    date
}