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
  LOG(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  var db = F.database('miku');
  if(msg.content.charAt(0) === settings.bot.trigger) {
    msg.content = msg.content.substr(1);
    var voiceChannel = msg.member.voiceChannel;

    //Get a random game based on Game tags
    if (msg.content.includes("gameshuffle") || msg.content.includes('gs')) {
      db.insert({
        user: {
          id: msg.author.id,
          username: msg.author.username,
          discriminator: msg.author.discriminator,
          avatar: msg.author.avatar
        },
        command: "gameshuffle",
        dateTime: Date.now()
      });
      msg.channel.send("はい！ I will find a game based on what I know you play.　えっと…");
      LOG("Check to see if in voice channel and if there is more than one");
      if(!voiceChannel){
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          LOG(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
          // msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `<@&${selected.id}>`)}`);
          msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `${selected.name}`)}`);
        });
      } else if(voiceChannel.members.size <= 0) {
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          LOG(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
          // msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `<@&${selected.id}>`)}`);
          msg.channel.send(`${msg.author}-san, ${settings.games.responses[Math.floor(Math.random()*settings.games.responses.length)].replace('$message$', `${selected.name}`)}`);
        });
      } else {
        getGamesList(msg.member)
        .then (function(games) {
          var selected = games.random();

          LOG(`Get ${msg.member.name}'s Voice Channel`);
          var voiceChannel = msg.member.voiceChannel;

          LOG(`Get Members of ${voiceChannel.name}`);
          var members = voiceChannel.members;
      
          LOG(`Check to see if ${voiceChannel.name} is more than one person`);
          if(members.size > 1) {

            LOG(`Itterate through possible games until one is found that everyone can play`);
            while(selected.weight != members.size) {
              LOG(`${selected.name}'s weight (${selected.weight}) does not match the needed minimum weight (${members.size})`);

              LOG(`Get random game`);
              selected = games.random();

              LOG(`Remove game from games list, so we don't try to match it again for efficency`);
              games.delete(selected.id);
            }
          } else {
            selected = games.random();
          }
          LOG(`Send a message to ${msg.channel.name} to suggest the game ${selected.name}`);
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

client.on('userUpdate', (oldName, newName) => {
  var discordDB = DATABASE('discord');

  LOG(oldName, newName);
});

client.on('presenceUpdate', (oldMember, newMember) => {
  var discordDB = DATABASE('discord');
  var data = {};
  data.userId = newMember.id;
  data.time = Date.now();
  data.status = newMember.presence.status;
  if(newMember.presence && newMember.presence.game) {
    data.playing = newMember.presence.game.name;
    data.type = newMember.presence.game.type;
    LOG(`[${new Date(data.time).toLocaleString()}] User ${newMember.user.username}#${newMember.user.discriminator} is now playing ${data.playing} (${data.type})`);
  } else if(oldMember.presence.game) {
    LOG(`[${new Date(data.time).toLocaleString()}] User ${newMember.user.username}#${newMember.user.discriminator} is no longer playing ${oldMember.presence.game.name}`);
  } else {
    LOG(`[${new Date(data.time).toLocaleString()}] User ${oldMember.user.username}#${oldMember.user.discriminator} is ${data.status}`);
  }
  discordDB.insert(data);
});

var getGamesList = function(user) {
  LOG("Make new Collection");
  games.clear();
  if(user.voiceChannel) {
    LOG("Itterate through every Voice Channel Member");
    user.voiceChannel.members.every((member) => {

      LOG(`Itterate through ${member.id}'s roles`);
      member.roles.every((role) => {

        LOG(`Check to see if ${role.name}'s color is right`);
        if(role.color == settings.games.roleColor) {

          LOG(`Put ${role.name} in the new Collection`);
          if(!games.exists("id", role.id))
            games.set(role.id, {
              name: role.name,
              id: role.id,
              weight: 0
            });

          LOG(`Add weight to ${games.get(role.id).name}`);
          games.get(role.id).weight++;

        } else {
          LOG(`${role.name} is not a game`);
        }

        return role;
      });

      return member;
    });
  } else {
    LOG(`Itterate through ${user.id}'s roles`);
    user.roles.every((role) => {

      LOG(`Check to see if ${role.name}'s color is right`);
      if(role.color == settings.games.roleColor) {

        LOG(`Put ${role.name} in the new Collection`);
        if(!games.exists("id", role.id))
          games.set(role.id, {
            name: role.name,
            id: role.id,
            weight: 0
          });

        LOG(`Add weight to ${games.get(role.id).name}`);
        games.get(role.id).weight++;

      } else {
        LOG(`${role.name} is not a game`);
      }

      return role;
    });
  }

  return Promise.resolve(games);
}

client.login(settings.bot.token);