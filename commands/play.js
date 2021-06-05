const ytdl = require('ytdl-core')
const search = require('youtube-search')

   const playSong = async (message,args, serverQueue, queue, play) => {
    
    const voiceChannel = message.member.voice.channel;
    var argIsUrl = false
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
            key: 'AIzaSyAi8exEgT11gaLBFMp7d3ERpdav3TPXir0', //Necesitas una CLAVE de la API de youtube. 
            type: "video" // Que tipo de resultado a obtener.
        };
        if (args[0].startsWith('http')) argIsUrl = true
        let songArg
        let songURL
        if (argIsUrl){
           songArg = 'noArgs';
           songURL = args[0];
        }else{
           songArg = await search(args.join(' '), opts);
           songURL = songArg.results[0].link;
        }
        
        const songInfo = await ytdl.getInfo(songURL);
        const song = {
            title: songInfo.videoDetails.title,
            duration: songInfo.videoDetails.lengthSeconds,
            url: songInfo.videoDetails.video_url,
            thumbnail: songInfo.videoDetails.thumbnails[1].url,
            author: message.author.tag
        };
        // <-- Verificamos la lista de canciones de un servidor -->
        if (!serverQueue) {
            // Si NO hay una lista de música.
              // <-- Creamos nuestra cola de música a reproducir  -->

        // Creamos el conjunto de datos para nuestra cola de música
        const queueObject = {
            textChannel: message.channel, //guardamos el canal de texto
            voiceChannel: voiceChannel, // guardamos el canal de voz
            connection: null, // un objeto para la conexión 
            songs: [], // creamos la lista de canciones
            volume: 2, // volumen al iniciar la cola
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
          
          }else {
            // Si HAY una lista de música reproduciendo.
          
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);
          
          }
                        
   }
   module.exports = { playSong }