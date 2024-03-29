const Discord = require('discord.js'); // Define the discord.js module
const client = new Discord.Client(); // Creating discord.js client (constructor)
const disbut = require('discord-buttons'); // Starting the discord-buttons class
disbut(client)
const config = require("./config.json")
const ytdl = require('ytdl-core')
const axios = require('axios')
require('dotenv').config()

const admin = require("firebase-admin");

const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id":process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
  }
  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gary-62a0f.appspot.com'
  });
const db = admin.firestore();

const { helpEmbed1,helpEmbed2,helpEmbedMusic } = require('./commands/embeded.js')
const { playSong } = require('./commands/play.js')
const { shikePunch } = require('./commands/punch.js')
const { joinChannel, leaveChannel } = require("./commands/join_leave.js")
const { sendMeme, sendMemeFailed, debateMeme, debateMemeFailed } = require("./commands/borderMeme")
const { memberJoined } = require("./commands/memberJoined")
const { make3ds } = require("./commands/3ds")
const { featureDante } = require("./commands/dante")
const { quote } = require("./commands/quote")
const { watchTogueter } = require("./commands/watchTogether");

const prefix = "g "
const play = (guild, song,msg) =>  {
    const serverQueue = queue.get(guild.id);
    // verificamos que hay musica en nuestro objeto de lista
    if (!song) {
    queue.delete(guild.id);
    serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
    // setTimeout(function(){ 
    //     serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
    //  }, 300000);
     return;
    }

    // <-- Reproducción usando play()  -->
    const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
    // Elimina la canción terminada de la cola.
    serverQueue.songs.shift();

    // Llama a la función de reproducción nuevamente con la siguiente canción
    play(guild, serverQueue.songs[0],msg);
    })
    .on('error', error => {
    console.error(error);
    client.channels.cache.get('81824684462014465').send('Ha ocurrido un error, espera un momento y vuelve a intentarlo (`g delete` podria ayudar)')
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

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'subnormales-texto');

    memberJoined(member,channel)
    });

const queue = new Map();
const embed = new Discord.MessageEmbed()
.setTitle("Gary help")
.setDescription("¿En que te puedo ayudar? :wink: ")
.setColor(config.COLOR_EMBED)  
let Commands1 = new disbut.MessageButton()
.setStyle('blurple')
.setID('commands_1') 
.setLabel('Comandos')
.setEmoji('👉')
let leftArrow = new disbut.MessageButton()
.setStyle('grey')
.setID('left') 
.setLabel('')
.setEmoji('⬅️')
let RightArrow = new disbut.MessageButton()
.setStyle('grey')
.setID('right') 
.setLabel('')
.setEmoji('➡️')
let Commands2 = new disbut.MessageButton()
.setStyle('blurple')
.setID('commands_2') 
.setLabel('Comandos')
.setEmoji('2️⃣')
let CommandsMusic = new disbut.MessageButton()
.setStyle('blurple')
.setID('commands_3') 
.setLabel('Comandos Música')
.setEmoji('🎵')
let Invite = new disbut.MessageButton()
.setStyle('green')
.setID('invite') 
.setLabel('Invite‎‎')
.setEmoji('📩')
let Delete = new disbut.MessageButton()
.setStyle('red')
.setID('commands_delete') 
.setLabel('Exit')
let GoBack = new disbut.MessageButton()
.setStyle('grey')
.setID('GoBack') 
.setLabel('Go back')
.setEmoji('⬅️')

client.on('clickButton', async (button) => {
    switch (button.id) {
        case 'commands_1':
            await button.defer().catch(console.error)
            await button.message.delete()
            await button.channel.send({buttons: [RightArrow,GoBack,Delete], embed:helpEmbed1})
            break;
        case 'commands_3':
            await button.defer().catch(console.error)
            button.message.delete()
            button.channel.send({buttons: [GoBack,Delete], embed:helpEmbedMusic})
            break;
        case 'left':
            await button.defer().catch(console.error)
            button.message.delete()
            button.channel.send({buttons: [RightArrow,GoBack,Delete], embed:helpEmbed1})
            break;
        case 'right':
            await button.defer().catch(console.error)
            button.message.delete()
            button.channel.send({buttons: [leftArrow,GoBack,Delete], embed:helpEmbed2})
            break;
        case 'GoBack':
            await button.defer().catch(console.error)
            button.message.delete()
            button.channel.send({ buttons: [Commands1,CommandsMusic,Invite,Delete],  embed })
            break;
        case 'commands_delete':
            await button.defer().catch(console.error)
            await button.message.delete()
            break;
        case 'invite':
            await button.defer().catch(console.error)
            await button.channel.send('https://discord.com/api/oauth2/authorize?client_id=849605392027353108&permissions=8&scope=bot')
            break;
        default:
            break;
    }
    })
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
            message.channel.send({ buttons: [Commands1,CommandsMusic,Invite,Delete],  embed })       
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
            playSong(message, args, serverQueue, queue, play, disbut).catch(console.error)
            
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
            }
            if (args.length === 0 && serverQueue.songs[1]){
            await serverQueue.connection.dispatcher.destroy();
            serverQueue.songs.splice(0,1)
            message.channel.send(`Reproduciendo ahora: **${serverQueue.songs[0].title}**`);
            play(guild=message.guild, song=serverQueue.songs[0],msg=message);
            return
            }
             serverQueue.songs = [];
         
            // Finalizamos el dispatcher
             await serverQueue.connection.dispatcher.end();
             message.channel.send('No hay más canciones, me piro.')   
            
            break;
        case '8ball':

            var rpts = ["Sí", "No", "¿Por qué?", "Por favor", "Tal vez ", "Nah", "Definitivamente?", " Claro "," YEEE "," Lmao no "," Por supuesto! "," Por supuesto que no ","Cállate zorra"];
            if (!texto) return message.reply(`Escriba una pregunta.`);
            message.reply(rpts[Math.floor(Math.random() * rpts.length)]);

            break;
        case 'queue':
        case 'q':
            if (!serverQueue | serverQueue === null ) return message.channel.send('¡No hay canción que mostrar!, la cola esta vacía');
            let i = 1
        
            // Listamos las canciones de la cola
            let list = serverQueue.songs.slice(1).map((m) => {
                 if(i > 10) return // Lista solo 15 canciones
                i++;
                return `[${i}] - 🎵 ${m.title}  / 👤 Por: ${m.author.name ? m.author.name : m.author}` // Construimos la info por cada canción
                    
               }).join('\n')
                
             let hr = "---------------------------------------------"
             // El tiempo de reproduccion de la canción
             let time = Math.trunc(serverQueue.connection.dispatcher.streamTime / 1000) 
             
             function str_pad_left(string,pad,length) {
                return (new Array(length+1).join(pad)+string).slice(-length);
            }
             // Agregarmos la canción actual reproduciendo
             let playName  = 
                `${hr}\n🔊 Ahora: ${serverQueue.songs[0].title}\n🕐 Tiempo: (${str_pad_left(Math.floor(time / 60),'0',2)}:${str_pad_left((time - (Math.floor(time / 60)) * 60),'0',2)} / ${serverQueue.songs[0].length}) \n👤 Por: ${serverQueue.songs[0].author.name}\n${hr}`

            // La cantidad de canciones encontradas
             let countSong = `\n${hr}\n ${serverQueue.songs.length > 1 ? `${serverQueue.songs.length} canciones.` : `${serverQueue.songs.length} canción.` } `
             let listValue = `${list ? list : 'No hay canciones en cola'}`
            const songInfoEmbed = new Discord.MessageEmbed()
            .setColor(config.COLOR_EMBED)
            .setTitle('LISTA DE CANCIONES')
            .setThumbnail(`${serverQueue.songs[0].thumbnail_url}`)
            .addFields(
                {name:'Reproduciendo',value: playName},
                {name:'En cola', value: listValue},
                {name:'Canciones', value:countSong}
            )
            .setTimestamp()
            .setFooter('Gary \'s vessel', 'https://i.imgur.com/AVrgZHK.png')
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
        case 'border':
            
            if (message.attachments.array()[0] === undefined && message.reference === null) {
                message.channel.send('Incluye una imagen primero, anda')
                sendMemeFailed(message)
            }else{
                sendMeme(message,args)
            }
            break;
        case '3ds':
            make3ds(message)
            break;
        case 'dante':
            featureDante(message)
            break;
        case 'quote':
            quote(message)
            break;
        case 'watchyt':
            if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz.');
            watchTogueter(message, disbut)
            break;
        case 'debate':
            if (args.length === 0) {
                message.channel.send('Incluye algun texto, no?')
                debateMemeFailed(message)
            }else{
                console.log(args)
                debateMeme(message,args)
            }
            break;
        case 'delete':
            if(args.length !== 0) return
            if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz.');
            if (!message.guild) return message.channel.send('No hay ninguna cola que eliminar')
            queue.delete(message.guild.id);
            message.channel.send('La cola ha sido eliminada')
            leaveChannel(message)
            break;
        case 'shuffle':
            if (!message.member.voice.channel) return message.channel.send('Debes unirte a un canal de voz.');
            if (serverQueue === undefined) return message.channel.send('No hay ninguna cola a la que hacer shuffle')
            function shuffle(arr) {
                if (arr.length < 3) {
                  return arr;
                }
                
                // Note the -2 (instead of -1) and the i > 1 (instead of i > 0):
                
                for (let i = arr.length - 2; i > 1; --i) {
                    const j = 1 + Math.floor(Math.random() * i);
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                
                return arr;
              }
              
            shuffle(serverQueue.songs)
            message.channel.send('La cola ha sido mezclada')

            break;
            case 'save':
                if (message.attachments.array()[0] === undefined && message.reference === null) {
                    message.channel.send('Incluye una imagen primero, anda')
                }else{
                     let file
                     if (message.reference === null){
                        file = message.attachments.array()[0].url
                       }else{
                        const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
                        if(repliedTo.attachments.array()[0] !== undefined)
                        file = repliedTo.attachments.array()[0].url
                       }
                      console.log(file)
                       if (file) {
                            await db.collection('images').doc().set({url: file})
                            message.channel.send('Imagen guardada!')
                       }else{
                            message.channel.send('No puedo guardar eso.')
                       }
                       
                }
                break;
            case 'garys':
                function shuffle(array) {
                    let currentIndex = array.length,  randomIndex;
                  
                    // While there remain elements to shuffle...
                    while (currentIndex != 0) {
                  
                      // Pick a remaining element...
                      randomIndex = Math.floor(Math.random() * currentIndex);
                      currentIndex--;
                  
                      // And swap it with the current element.
                      [array[currentIndex], array[randomIndex]] = [
                        array[randomIndex], array[currentIndex]];
                    }
                  
                    return array;
                  }
                  
                const images = []
                let imagesRef = await db.collection("images").get()
                imagesRef.docs.forEach(doc =>{
                    images.push(doc.data())
                })
                shuffle(images)
                shuffle(images)
                message.channel.send(images[0].url)
                break;
            case 'galeria':
                if (message.attachments.array()[0] === undefined && message.reference === null) {
                    message.channel.send('Incluye una imagen primero, anda')
                }else{
                    let file
                    if (message.reference === null){
                        file = message.attachments.array()[0].url
                       }else{
                        const repliedTo = await message.channel.messages.fetch(message.reference.messageID);
                        file =  repliedTo.attachments.array()[0].url
                       }
                       const embed = new Discord.MessageEmbed()
                          .setTitle('¿A qué canal lo enviamos? 🖼💨')
                          .setColor(config.COLOR_EMBED);
                          let Option1 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('one') 
                          .setLabel(`1. Garabacetos`)
                          let Option2 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('two') 
                          .setLabel(`2. Con colorcito`)
                          let Option3 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('three') 
                          .setLabel(`3. Con colorcito pngs`)
                          let Option4 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('four') 
                          .setLabel(`4. Fotitos y capturas`)
                          let Option5 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('five') 
                          .setLabel(`5. Gifts and more cosos`)
                          let Option6 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('six') 
                          .setLabel(`6. No pos meme material`)
                          let Option7 = new disbut.MessageButton()
                          .setStyle('gray')
                          .setID('seven') 
                          .setLabel(`7. Gartic phone`)
                
                          let buttonRow1 = new disbut.MessageActionRow()
                          .addComponent(Option1).addComponent(Option2).addComponent(Option3)
                          .addComponent(Option4)
                          let buttonRow2 = new disbut.MessageActionRow()
                           .addComponent(Option5).addComponent(Option6)
                           .addComponent(Option7)
                          let m = await message.channel.send({components: [buttonRow1,buttonRow2], embed:embed})
                        
                
                          const filter = (button) => button.clicker.user.id === message.author.id;
                          const collector = m.createButtonCollector(filter, { time: 20000 });
                          collector.on('collect', async b => {
                            console.log(b.id)
                            b.defer()
                            if (b.id === 'one') {
                                client.channels.cache.get('562337252328341504').send(file)
                              b.message.delete()
                              collector.stop()
                            } else if (b.id === 'two') {
                                client.channels.cache.get('562364482396094464').send(file)
                              b.message.delete()
                              collector.stop()
                
                            } else if (b.id === 'three') {
                                client.channels.cache.get('562365885310959617').send(file)
                              b.message.delete()
                              collector.stop()
                
                            }else if (b.id === 'four') {
                                client.channels.cache.get('562368479341182976').send(file)
                              b.message.delete()
                              collector.stop()
                            }else if (b.id === 'five') {
                                client.channels.cache.get('562364723836878887').send(file)
                              b.message.delete()
                              collector.stop()
                            }else if (b.id === 'six') {
                                client.channels.cache.get('575113407003623430').send(file)
                            b.message.delete()
                            collector.stop()
                            }else if (b.id === 'seven') {
                                client.channels.cache.get('892605016274247750').send(file)
                            b.message.delete()
                            collector.stop()
                              }
                            
                          })
                          
                }
                break;
            default:
             message.channel.send('que dise ahi nose ingle')
                break;
        }    
          
    });
client.login(process.env.BOT_TOKEN)