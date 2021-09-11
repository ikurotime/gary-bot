const Discord = require("discord.js")
const fetch = require('node-fetch')
const config = require("../config.json")

const watchTogueter = async (message, disbut) => {
    let channel = message.member.voice.channel
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`,{
        method: "POST",
        body: JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: "755600276941176913",
            target_type: 2,
            temporary: false,
            validate: null
        }),
        headers:{
            "Authorization":`Bot ${process.env.BOT_TOKEN}`,
            "Content-type":"application/json"
        }
    }).then(res => res.json()).then(invite =>{
        if(!invite.code) return message.channel.send("No puedo empezar un Yt together :(, que el otro tonto mire que ha pasado.")
        const embed = new Discord.MessageEmbed()
        .setTitle("Youtube Together")
        .setDescription("Gary te ha invitado a ver Youtube  :sunglasses:")
        .setColor('RED')
      
      
        let button = new disbut.MessageButton()
        .setStyle('url')
        .setURL(`https://discord.com/invite/${invite.code}`) 
        .setLabel('Unirse')
      
      message.channel.send({ button: button, embed: embed });
    }).then(msg => msg.delete({options: 18000}))
    }
module.exports = { watchTogueter }