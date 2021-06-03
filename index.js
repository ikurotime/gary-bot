const Discord = require("discord.js")
const config = require("./config.json")
const Canvas = require('canvas');
const ytdl = require('ytdl-core');
const search = require('youtube-search');

const client = new Discord.Client()
const prefix = "-g ";

const exampleEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Gary te ayuda           ')
.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
.setDescription('*Esto es lo que puedo hacer*')
.setThumbnail('https://i.imgur.com/wSTFkRM.png')
.addFields(
    { name: '`-g say [contenido]`', value: 'Digo lo que quieras' },
    { name: '`-g punch`', value: 'Pegale al Shike en la cara'},
    { name: '`-g ching`', value: 'Chong!'},
)
    .setTimestamp()
.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

client.on('ready', () => {
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
            message.channel.send(exampleEmbed);
            break;
        case 'ching':
            message.channel.send(`Chong!`);
            break;
        case 'gary':
            message.channel.send(`El todopoderoso`);
            break;
        case 'say':
            if(!texto) return message.reply(`Escribe algo para decir.\n \`!g say [contenido]\``);
            message.delete({options:100});
            message.channel.send(texto);
            break;
        case 'punch':
        message.channel.send('Espera que tomo la foto...')

        const shikePunch = async () => {
            const canvas = Canvas.createCanvas(1336, 1087);
            const context = canvas.getContext('2d');
            // Since the image takes time to load, you should await it
            const background = await Canvas.loadImage('./img/shike_punch.png');
            // This uses the canvas dimensions to stretch the image onto the entire canvas
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
            context.drawImage(avatar, 605, 325, 300, 300);

            // Use the helpful Attachment class structure to process the file for you
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        
            message.channel.send(`${message.author} ha pegado a Shike!`, attachment);
            }

        shikePunch()
            break;
        case 'join':
            let canalvoz = message.member.voice.channel;
            if(!canalvoz || canalvoz.type !== 'voice') {
                message.channel.send('¡Necesitas unirte a un canal de voz primero!.');
            
            } else if (message.guild.voiceConnection) {
                message.channel.send('Ya estoy conectado en un canal de voz.');
            
            } else {
                message.channel.send('Conectando...').then(m => {
                    canalvoz.join().then(() => {
                        m.edit('Conectado exitosamente.').catch(error => console.log(error));
            
                    }).catch(error => console.log(error));
            
                }).catch(error => console.log(error));
            
        }
        break;
        case 'leave':
            let Canalvoz = message.member.voice.channel;

            if(!Canalvoz) {
                message.channel.send('No estas conectado a un canal de voz.');

            } else {
                message.channel.send('Dejando el canal de voz.').then(() => {
                    Canalvoz.leave();
                }).catch(error => console.log(error));
            } 
        break;
        case 'play':
        
            const voiceChannel = message.member.voice.channel;
    
            //verificamos que el usuario solicitante este conectado en un canal de voz.
              if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
          
              const permissions = voiceChannel.permissionsFor(message.client.user);
          
            //verificamos que el bot tenga permisos de conectar y de hablar en el canal de voz.
              if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('¡Necesito permisos para unirme y hablar en el canal de voz!');
              }
            
            // <-- Capturamos la información de la música a reproducir -->
            var opts = {
              maxResults: 1, //Maximo de resultados a encontrar
              key: 'API-KEY-YOUTUBE', //Necesitas una CLAVE de la API de youtube. 
              type: "video" // Que tipo de resultado a obtener.
            };
          
            const songArg = await search(args.join(' '), opts);
            const songURL = songArg.results[0].link;
            const songInfo = await ytdl.getInfo(songURL);
          
            const song = {
              title: songInfo.title,
              url: songInfo.video_url,
              author: message.author.tag
            };
          
          // <-- Verificamos la lista de canciones de un servidor -->
          if (!serverQueue) {
              // Si NO hay una lista de música.
             
              // Creamos el conjunto de datos para nuestra cola de música
              const queueObject = {
                  textChannel: message.channel, //guardamos el canal de texto
                  voiceChannel: voiceChannel, // guardamos el canal de voz
                  connection: null, // un objeto para la conexión 
                  songs: [], // creamos la lista de canciones
                  volume: 5, // volumen al iniciar la cola
                  playing: true, // un objeto para validar la cola de música en reproducción.
              };
              
              // <-- Establecer la cola de música  -->
              // Creando el conjunto de datos para nuestra cola de música
              queue.set(message.guild.id, queueObject);
      
              // Agregamos las canciones al conjunto de datos
              queueObject.songs.push(song);
      
              // <-- Conectar al canal de voz  -->
              try {
                  // Aquí unimos el bot al canal de voz y guardar nuestra conexión en nuestro objeto.
                  var connection = await voiceChannel.join();
                  queueObject.connection = connection;
                 
                  message.channel.send(`Reproduciendo ahora: **${song.title}**`);
                 
                  // Llamar a la función de reproducción para comenzar una canción.
                  play(message.guild, queueObject.songs[0]);
                 
                 } catch (err) {
                 
                  // Imprimir el mensaje de error si el bot no puede unirse al chat de voz
                  console.log(err);
                  queue.delete(message.guild.id);
                  return message.channel.send(err);
                 
                 }
                 
                 function play(guild, song) {
                  const serverQueue = queue.get(guild.id);
                  // verificamos que hay musica en nuestro objeto de lista
                  if (!song) {
                   serverQueue.voiceChannel.leave(); // si no hay mas música en la cola, desconectamos nuestro bot
                   queue.delete(guild.id);
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
            
            }else {
              // Si HAY una lista de música reproduciendo.
            
              serverQueue.songs.push(song);
              console.log(serverQueue.songs);
              return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);
            
            }
                
        break;
        default:
            message.channel.send('a')
            break;
    }      
      
});

client.login(config.BOT_TOKEN)