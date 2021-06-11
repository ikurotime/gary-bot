const Discord = require("discord.js")
const Canvas = require('canvas')

const quote = async (message) => {
    const getWrapText = (text, length) => {
        const temp = [];
        for (let i = 0; i < text.length; i += length) {
          temp.push(text.slice(i, i + length));
        } 
        temp.forEach(function(value, index){
            temp[index] = value.trim();
            });    
        let texto = temp.join("\n");
        return texto;
      }
    if (message.reference === null){
        message.channel.send('Responde a un mensaje para hacer la quote')
        return
    }else{
    const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
    const canvas = Canvas.createCanvas(850, 400);
    const context = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./img/quote.png');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(repliedTo.author.displayAvatarURL({ format: 'jpg' }));
    context.drawImage(avatar, 100, 100, 200, 200);
    context.font = '40px sans-serif';
	context.fillStyle = '#ffffff';
    context.fillText(getWrapText(repliedTo.content,20), 370, 180);
    context.font = '30px sans-serif';
    context.fillText('-'+repliedTo.author.username, 680, 330);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '3ds.png');
    message.channel.send(attachment)
    }

   
    }
module.exports = { quote }