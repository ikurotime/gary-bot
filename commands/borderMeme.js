const Canvas = require('canvas');
const Discord = require("discord.js")

const sendMeme = async (message,args) => {
    
   const canvas = Canvas.createCanvas(655, 613);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage('./img/blackborder.jpeg');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
     context.drawImage(background, 0, 0, canvas.width, canvas.height);
     let avatar
     if (message.reference === null){
         avatar = await Canvas.loadImage(message.attachments.array()[0].url)
        }else{
         const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
         avatar = await Canvas.loadImage(repliedTo.attachments.array()[0].url)
        }
     context.drawImage(avatar, 60, 60, 538, 355);
     context.font = '60px sans-serif';
	// Select the style that will be used to fill the text in
	context.fillStyle = '#ffffff';
	// Actually fill the text with a solid color
    context.textAlign= 'center'
    let texto = args.join(" ");
    let cadenaTexto = texto.split('-',2)
	context.fillText(cadenaTexto[0], canvas.width / 2, 500);
    if (args.length >= 1 ) {
        context.font = '30px sans-serif';
        context.fillStyle = '#ffffff';
        context.textAlign= 'center'
        args.shift()
        context.fillText(cadenaTexto[1], canvas.width / 2, 550)
    }
    // Use the helpful Attachment class structure to process the file for you
     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'borderMeme.png');

    message.channel.send(attachment); 
}
module.exports = { sendMeme }