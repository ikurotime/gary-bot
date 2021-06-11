const Discord = require("discord.js")
const Canvas = require('canvas')

const featureDante = async (message) => {
    
    // Since the image takes time to load, you should await it
    let background
    let canvas
    let context
     if (message.reference === null){
         canvas = Canvas.createCanvas(message.attachments.array()[0].width, message.attachments.array()[0].height);
         context = canvas.getContext('2d');
        background = await Canvas.loadImage(message.attachments.array()[0].url)
        }else{
            
         const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
          canvas = Canvas.createCanvas(repliedTo.attachments.array()[0].width, repliedTo.attachments.array()[0].height);
          context = canvas.getContext('2d');
         background = await Canvas.loadImage(repliedTo.attachments.array()[0].url)
        }
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage('./img/dante.png');
    context.drawImage(avatar, canvas.width / 1.5, canvas.width / 1.8, canvas.width / 4, canvas.height / 3.5);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '3ds.png');
    message.channel.send(attachment)
    }
module.exports = { featureDante }