exports.id = 'miku';
exports.version = '0.0.1';

const fs = require('fs');
const Promise = require('promise');
const Discord = require("discord.js");
const client = new Discord.Client();
let settings = fs.readFileSync("settings.json");
settings = JSON.parse(settings);


const games = new Discord.Collection();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  if(msg.content.charAt(0) === settings.bot.trigger) {
    msg.content = msg.content.substr(1);
    var voiceChannel = msg.member.voiceChannel;

    //Get a random game based on Game tags
    if (msg.content.includes("gameshuffle") || msg.content.includes('gs')) {
      msg.channel.send("はい！ I will find a game based on what I know you play.　えっと…");
      console.log("Check to see if in voice channel and if there is more than one");
      if(!voiceChannel){
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          console.log(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
          // msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `<@&${selected.id}>`)}`);
          msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `${selected.name}`)}`);
        });
      } else if(voiceChannel.members.size <= 0) {
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          console.log(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
          // msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `<@&${selected.id}>`)}`);
          msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `${selected.name}`)}`);
        });
      } else {
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          console.log(`Get ${msg.member.name}'s Voice Channel`);
          var voiceChannel = msg.member.voiceChannel;

          console.log(`Get Members of ${voiceChannel.name}`);
          var members = voiceChannel.members;
      
          console.log(`Check to see if ${voiceChannel.name} is more than one person`);
          if(members.size > 1) {

            console.log(`Itterate through possible games until one is found that everyone can play`);
            while(selected.weight != members.size) {
              console.log(`${selected.name}'s weight (${selected.weight}) does not match the needed minimum weight (${members.size})`);

              console.log(`Get random game`);
              selected = games.random();

              console.log(`Remove game from games list, so we don't try to match it again for efficency`);
              games.delete(selected.id);
            }
          } else {
            selected = games.random();
          }
          console.log(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
          // msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `<@&${selected.id}>`)}`);
          msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `${selected.name}`)}`);
          return Promise.resolve();
        });
      }
    } else {
      msg.channel.send(`なに？　${msg.author}-san, I don't understand.`);
    }
    //END

  }
});

var getGamesList = function(user) {
  console.log("Make new Colelction");
  games.clear();
  if(user.voiceChannel) {
    console.log("Itterate through every Voice Channel Member");
    user.voiceChannel.members.every((member) => {

      console.log(`Itterate through ${member.id}'s roles`);
      member.roles.every((role) => {

        console.log(`Check to see if ${role.name}'s color is right`);
        if(role.color == settings.games.roleColor) {

          console.log(`Put ${role.name} in the new Collection`);
          if(!games.exists("id", role.id))
            games.set(role.id, {
              name: role.name,
              id: role.id,
              weight: 0
            });

          console.log(`Add weight to ${games.get(role.id).name}`);
          games.get(role.id).weight++;

        } else {
          console.log(`${role.name} is not a game`);
        }

        return role;
      });

      return member;
    });
  } else {
    console.log(`Itterate through ${user.id}'s roles`);
    user.roles.every((role) => {

      console.log(`Check to see if ${role.name}'s color is right`);
      if(role.color == settings.games.roleColor) {

        console.log(`Put ${role.name} in the new Collection`);
        if(!games.exists("id", role.id))
          games.set(role.id, {
            name: role.name,
            id: role.id,
            weight: 0
          });

        console.log(`Add weight to ${games.get(role.id).name}`);
        games.get(role.id).weight++;

      } else {
        console.log(`${role.name} is not a game`);
      }

      return role;
    });
  }

  return Promise.resolve(games);
}

client.login(settings.bot.token);