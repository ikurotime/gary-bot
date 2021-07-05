const Canvas = require('canvas');
const Discord = require("discord.js");
const { getWrapText } = require('./quote');

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
    if (cadenaTexto[1] === undefined) {
        context.fillText(" ", canvas.width / 2 - 10, 550) 
    }else{
        if (args.length >= 1 ) {
            context.font = '30px sans-serif';
            context.fillStyle = '#ffffff';
            context.textAlign= 'center'
            args.shift()
            context.fillText(cadenaTexto[1], canvas.width / 2 - 10, 550)
        }
    }
    // Use the helpful Attachment class structure to process the file for you
     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'borderMeme.png');

    message.channel.send(attachment); 
}
const sendMemeFailed = async (message) =>{
   const repliedTo = await message.fetch(message);
   const canvas = Canvas.createCanvas(655, 613);
   const context = canvas.getContext('2d');

   const background = await Canvas.loadImage('./img/blackborder.jpeg');
   // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    let avatar = await Canvas.loadImage(repliedTo.author.displayAvatarURL({ format: 'jpg' }))
   
    context.drawImage(avatar, 60, 60, 538, 355);
    context.font = '60px sans-serif';
   // Select the style that will be used to fill the text in
   context.fillStyle = '#ffffff';
   // Actually fill the text with a solid color
   context.textAlign= 'center'
 
   context.fillText(repliedTo.author.username + ' no sabe', canvas.width / 2, 500);
   
    context.font = '30px sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign= 'center'
     
    context.fillText(repliedTo.author.username + ' no sabe usar a Gary', canvas.width / 2 - 10, 550)
   
   // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'borderMeme.png');

   message.channel.send(attachment); 
}
const debateMeme = async (message,args) =>{
    const canvas = Canvas.createCanvas(400, 218);
    const context = canvas.getContext('2d');
    const repliedTo =  await message.channel.messages.fetch(message.reference.messageID);
   
    const background = await Canvas.loadImage('./img/debate.png');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = '17px sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign= 'left'
    if (message.reference) {
    context.fillText(getWrapText(repliedTo.content,47), 15, 178);
    }else{ 
    let texto = args.join(" ");
    context.fillText(getWrapText(texto,47), 15, 178);}
   
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'debate.png');

    message.channel.send(attachment); 
}
module.exports = { sendMeme, sendMemeFailed, debateMeme}