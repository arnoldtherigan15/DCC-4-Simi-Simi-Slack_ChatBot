const Slackbot = require('slackbots')
const axios = require('axios')
require('dotenv').config()

const bot = new Slackbot({
    token : `${process.env.BOT_TOKEN}`,
    name: 'simi'
})

//start handler

bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    }

    bot.postMessageToChannel('general', 'Chat with @simi if you are lonely !', params)
})

bot.on('error', (err) => {
    console.log(err, 'error')
})

bot.on('message', (data) => {
    if(data.type !== 'message') return
    handleMessage(data.text)
})

function handleMessage (message) {
    if(message.includes(' chucknorris')) {
        chuckJoke()
    } else if (message.includes(' yomama')) {
        yoMamaJoke()
    } else if (message.includes(' help')) {
        helpMsg()
    } else if (message.includes(' msg/')) {
        let newMsg = message.split('/')
        chat(newMsg)
    }
}

function chuckJoke () {
    axios({
        method: 'get',
        url: 'http://api.icndb.com/jokes/random'
    })
        .then(({data})=> {
            let joke = data.value.joke
            const params = {
                icon_emoji: ':laughing:'
            }
        
            bot.postMessageToChannel('general', `Chuck Norris : ${joke}`, params)
        })
        .catch(err => {
            console.log(err)
        })
}

function yoMamaJoke () {
    axios({
        method: 'get',
        url: 'http://api.yomomma.info'
    })
        .then(({data})=> {
            let joke = data.joke
            const params = {
                icon_emoji: ':laughing:'
            }
        
            bot.postMessageToChannel('general', `Yo Mama : ${joke}`, params)
        })
        .catch(err => {
            console.log(err)
        })
}

function helpMsg () {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel('general', `Chat with Simi type '@simi msg/' . Type @simi with either 'chucknorris' or 'yomama' to get jokes`, params)
}

function chat (msg) {
    axios({
        method: 'post',
        url: 'https://wsapi.simsimi.com/190410/talk',
        headers: {
            "x-api-key": `${process.env.SIMI_KEY}`,
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
          "utext": `${msg}`,
          "lang": "id"
        })
      })
        .then(({ data }) => {
            const params = {
                icon_emoji: ':laughing:'
            }
            bot.postMessageToChannel('general', `${data.atext}`, params)
          
        })
        .catch(err => {
            console.log(err,'error')  
        })
}