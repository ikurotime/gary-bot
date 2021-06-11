const Discord = require("discord.js")
const Canvas = require('canvas')

const make3ds = async (message) => {
    const canvas = Canvas.createCanvas(957, 834);
    const context = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./img/3ds.png');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    let avatar
     if (message.reference === null){
         avatar = await Canvas.loadImage(message.attachments.array()[0].url)
        }else{
         const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
         avatar = await Canvas.loadImage(repliedTo.attachments.array()[0].url)
        }
    context.drawImage(avatar, 3, 0, 850, 834);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '3ds.png');
    message.channel.send(attachment)
    }
module.exports = { make3ds }