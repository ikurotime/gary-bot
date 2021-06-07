const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const ytdl = require('ytdl-core')
const axios = require('axios')


const { exampleEmbed,exampleEmbed2 } = require('./commands/embeded.js')
const { playSong } = require('./commands/play.js')
const { shikePunch } = require('./commands/punch.js')
const { joinChannel, leaveChannel } = require("./commands/join_leave.js")

const prefix = "g "
const play = (guild, song) =>  {
    const serverQueue = queue.get(guild.id);
    // verificamos que hay musica en nuestro objeto de lista
    if (!song) {
    setTimeout(function(){ 
        serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
        queue.delete(guild.id);
     }, 300000);
     return;
    }

    // <-- Reproducción usando play()  -->
    const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
    // Elimina la canción terminada de la cola.
    serverQueue.songs.shift();

    // Llama a la función de reproducción nuevamente con la siguiente canción
    play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
    console.error(error);
    });

    // Configuramos el volumen de la reproducción de la canción
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
client.on('ready', () => {
    client.user.setActivity("g help", {
        type: "LISTENING"
      });
    console.log('Estoy Listo!');
   });

const queue = new Map();

client.on("message", async message =>{
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  let texto = args.join(" ");
  
    switch (command) {
        case 'help':
            const sendEmbed1 = () =>{
                message.channel.send(exampleEmbed).then(async sentEmbed =>{
                await sentEmbed.react('2️⃣')
                const validEmojis = ['2️⃣']
                const filter = (reaction, user) => {
                    return validEmojis.includes(reaction.emoji.name) && user.id === message.author.id;
                }
                const collector = sentEmbed.createReactionCollector(filter, { time: 20000, maxEmojis: 1 });
                collector.on('collect', (reaction) => {
                const name = reaction.emoji.name;
                      //you only use it in two cases but I assume you will use it for all later on
                      
                if (name === '2️⃣') {
                    sentEmbed.delete()
                    sendEmbed2()
                      }
                    })
                })
            }
            const sendEmbed2 = () =>{
                message.channel.send(exampleEmbed2).then(async sentEmbed =>{
                await sentEmbed.react('1️⃣')
                const validEmojis = ['1️⃣']
                const filter = (reaction, user) => {
                    return validEmojis.includes(reaction.emoji.name) && user.id === message.author.id;
                }
                const collector = sentEmbed.createReactionCollector(filter, { time: 20000, maxEmojis: 1 });
                collector.on('collect', (reaction) => {
                const name = reaction.emoji.name;
                      //you only use it in two cases but I assume you will use it for all later on
                      
                if (name === '1️⃣') {
                    sentEmbed.delete()
                    sendEmbed1()
                      }
                    })
                })
            }
            sendEmbed1()
            break;
        case 'ching':
            message.channel.send(`Chong!`);
            break;
        case 'gary':
            message.channel.send(`El todopoderoso`);
            break;
        case 'say':
            if(!texto) return message.reply(`Escribe algo para decir.\n \`g say [contenido]\``);
            message.delete({options:100});
            message.channel.send(texto);
            break;
        case 'punch':
            message.channel.send('Espera que tomo la foto...')
            shikePunch(message)
            break;
        case 'join':
            joinChannel(message)
            break;
        case 'leave':
            leaveChannel(message)
            break;
        case 'p':
        case 'play':
            if (!texto) return message.channel.send('Escribe alguna cancion o dame un link!')
            playSong(message, args, serverQueue, queue, play)
            
            break;
        case 's':
        case 'skip':
             // Aquí verificamos si el usuario que escribió el comando está en un canal de voz y si hay una canción que omitir.
            if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');
            // Aquí verificamos si el objeto de la lista de canciones esta vacía.
            if (!serverQueue) return message.channel.send('¡No hay canción que saltar!, la cola esta vacía');

            if (args){
                num = (parseInt(args) - 1)
                if(serverQueue.songs[num]){
                    if (num > -1){
                        message.channel.send(`Eliminado de la cola: **${serverQueue.songs[num].title}**`)
                        serverQueue.songs.splice(num,1)
                    }
                }
            }else{
             if (serverQueue.songs.length > 1){
            await serverQueue.connection.dispatcher.destroy();
            message.channel.send(`Reproduciendo ahora: **${serverQueue.songs[1].title}**`);
            play(message.guild, serverQueue.songs[1]);
            serverQueue.songs.shift()
            }else{
                 // Aquí borramos la cola de las canciones agregadas
            serverQueue.songs = [];
         
            // Finalizamos el dispatcher
            await serverQueue.connection.dispatcher.end();
            message.channel.send('No hay más canciones, me piro.')   
            }}
            
            break;
        case '8ball':

            var rpts = ["Sí", "No", "¿Por qué?", "Por favor", "Tal vez ", "Nah", "Definitivamente?", " Claro "," YEEE "," Lmao no "," Por supuesto! "," Por supuesto que no ","Cállate zorra"];
            if (!texto) return message.reply(`Escriba una pregunta.`);
            message.reply(rpts[Math.floor(Math.random() * rpts.length)]);

            break;
        case 'queue':
        case 'q':
            if (!serverQueue.songs[0]) return message.channel.send('¡No hay canción que mostrar!, la cola esta vacía');
            let i = 1
        
            // Listamos las canciones de la cola
            let list = serverQueue.songs.slice(1).map((m) => {
                // if(i > 16) return // Lista solo 15 canciones
                i++;
                return `[${i}] - 🎵 ${m.title}  / 👤 Por: ${m.author}` // Construimos la info por cada canción
                    
               }).join('\n')
                
             let hr = "---------------------------------------------"
             // El tiempo de reproduccion de la canción
             let time = Math.trunc(serverQueue.connection.dispatcher.streamTime / 1000) 
             
             function str_pad_left(string,pad,length) {
                return (new Array(length+1).join(pad)+string).slice(-length);
            }
             // Agregarmos la canción actual reproduciendo
             let playName = 
             `${hr}\n🔊 Ahora: ${serverQueue.songs[0].title}\n🕐 Tiempo: (${str_pad_left(Math.floor(time / 60),'0',2)}:${str_pad_left((time - (Math.floor(time / 60)) * 60),'0',2)} / ${str_pad_left(Math.floor(serverQueue.songs[0].duration / 60),'0',2) }:${str_pad_left((serverQueue.songs[0].duration - (Math.floor(serverQueue.songs[0].duration / 60)) * 60),'0',2)} )\n👤 Por: ${serverQueue.songs[0].author}\n${hr}`
             // La cantidad de canciones encontradas
             let countSong = `\n${hr}\n ${serverQueue.songs.length > 1 ? `${serverQueue.songs.length} canciones.` : `${serverQueue.songs.length} canción.` } `
             let listValue = `${list ? list : 'No hay canciones en cola'}`
            const songInfoEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('LISTA DE CANCIONES')
            .setThumbnail(`${serverQueue.songs[0].thumbnail}`)
            .addFields(
                {name:'Reproduciendo',value: playName},
                {name:'En cola', value: listValue},
                {name:'Canciones', value:countSong}
            )
            .setTimestamp()
            .setFooter('Gary \'s vessel', 'https://i.imgur.com/PuvozXs.png')
             message.channel.send(songInfoEmbed)
        
            break;
        case 'stop':

            if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz para detener la canción.');
            if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
            // Aquí borramos la cola de las canciones agregadas
            serverQueue.songs = [];
         
            // Finalizamos el dispatcher
            await serverQueue.connection.dispatcher.end();
            message.channel.send('Lista de canciones fue detenida.')
             
            break;
        case 'pause':
             // Validamos si la cola esta vacía 
            if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');
            if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');

            // Pausamos la canción en reproducción
            await serverQueue.connection.dispatcher.pause();
            
            message.channel.send(`Canción actual en pausa.`)
  
            break;
        case 'resume':
            // Validamos si la cola esta vacía 
        if (!serverQueue) return message.channel.send('¡No hay canción!, la cola esta vacía.');

        if (!message.member.voice.channel) return message.channel.send('debes unirte a un canal de voz.');

        // Reanudamos la canción pausada
        await serverQueue.connection.dispatcher.resume();
        
        message.channel.send(`Canción actual reanudada.`)
            break;
        case 'cursed':
            message.channel.send('lemme check the files').then(async msg => {
                const res = await axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=cursedcomments&sort=desc&size=1000')
                const getRandomInt = (min, max) => {
                    return Math.floor(Math.random() * (max - min)) + min;
                  }
                  nmb = getRandomInt(0,100)
                msg.delete({options: 1000}) 
                message.channel.send('cursedcomment nº'+nmb,{files: [res.data.data[nmb].url]})
            })
            break;
        case 'meme':
            message.channel.send('lemme check the files').then(async msg => {
                const res = await axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=memes&sort=desc&size=1000')
                const getRandomInt = (min, max) => {
                    return Math.floor(Math.random() * (max - min)) + min;
                  }
                  nmb = getRandomInt(0,100)
                msg.delete({options: 1000}) 
                message.channel.send('meme nº'+nmb,{files: [res.data.data[nmb].url]})
            })
            break;
        case 'kurama':
            message.delete()
            const getRandomInt = (min, max) => {
                return Math.floor(Math.random() * (max - min)) + min;
              }
              nmb = getRandomInt(1,8)
            message.channel.send({files: ['./img/kurama/kurama'+ nmb +'.jpeg']})
            if (nmb === 7) message.channel.send('squero')

            
            break;
        default:
            
            message.channel.send('que dise ahi nose ingle')
            break;
    }    
      
});

client.login(config.BOT_TOKEN)