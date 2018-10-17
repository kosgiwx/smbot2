const discord = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const CHANNEL = '로그-전용';
const bot = new discord.Client({disableEveryone: true});

// When bot ready
bot.on("ready", async () => {
  console.log(`${bot.user.username} is ready for action!`); 
});
bot.on('messageDelete', function(message) {

  if(message.channel.type == 'text') {

      //log to console
      console.log('[' + message.guild.name + '][#' + message.channel.name + '][DELMSG] ' + message.author.username +
          '#' + message.author.discriminator + ': ' + formatConsoleMessage(message));

      //post in the guild's log channel
      var log = message.guild.channels.find('name', CHANNEL);
      if (log != null)
          log.sendMessage('이놈이 뒷삭했습니다......' + message.author + ': ' + message.cleanContent);

  }

});

//message update
bot.on('messageUpdate', function(oldMessage, newMessage) {

  if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {

      //log to console
      console.log('[' + newMessage.guild.name + '][#' + newMessage.channel.name + '][UPDMSG] ' +
          newMessage.author.username + '#' + newMessage.author.discriminator + ':\n\tOLDMSG: ' +
          formatConsoleMessage(oldMessage) + '\n\tNEWMSG: ' + formatConsoleMessage(newMessage));

      //post in the guild's log channel
      var log = newMessage.guild.channels.find('name', CHANNEL);
      if (log != null)
          log.sendMessage('이놈이 말바꾸기를 합니다....' + newMessage.author + ' 원래 말...' + oldMessage.cleanContent +
              '...바꾼 말...' + newMessage.cleanContent);
  }

});
bot.on('guildMemberAdd', function(guild, user) {

  //log to console
  console.log('[' + guild.name + '][JOIN] ' + user.username + '#' + user.discriminator);

  //post in the guild's log channel
  var log = guild.channels.find('name', CHANNEL);
  if (log != null) {
      log.sendMessage('누군가 들어왔습니다...' + user);
  }

});

//user has joined a guild
bot.on('guildMemberRemove', function(guild, user) {

  //log to console
  console.log('[' + guild.name + '][LEAVE] ' + user.username + '#' + user.discriminator);

  //post in the guild's log channel
  var log = guild.channels.find('name', CHANNEL);
  if (log != null)
      log.sendMessage('누군가 나갔습니다......' + user);

});

//user in a guild has been updated
bot.on('guildMemberUpdate', function(guild, oldMember, newMember) {

  //declare changes
  var Changes = {
      unknown: 0,
      addedRole: 1,
      removedRole: 2,
      username: 3,
      nickname: 4,
      avatar: 5
  };
  var change = Changes.unknown;

  //check if roles were removed
  var removedRole = '';
  oldMember.roles.every(function(value) {
      if(newMember.roles.find('id', value.id) == null) {
          change = Changes.removedRole;
          removedRole = value.name;
      }
  });

  //check if roles were added
  var addedRole = '';
  newMember.roles.every(function(value) {
      if(oldMember.roles.find('id', value.id) == null) {
          change = Changes.addedRole;
          addedRole = value.name;
      }
  });

  //check if username changed
  if(newMember.user.username != oldMember.user.username)
      change = Changes.username;

  //check if nickname changed
  if(newMember.nickname != oldMember.nickname)
      change = Changes.nickname;

  //check if avatar changed
  if(newMember.user.avatarURL != oldMember.user.avatarURL)
      change = Changes.avatar;

  //log to console
  switch(change) {
      case Changes.unknown:
          console.log('[' + guild.name + '][UPDUSR] ' + newMember.user.username + '#' + newMember.user.discriminator);
          break;
      case Changes.addedRole:
          console.log('[' + guild.name + '][ADDROLE] ' + newMember.user.username +'#' +  newMember.user.discriminator +
              ': ' + addedRole);
          break;
      case Changes.removedRole:
          console.log('[' + guild.name + '][REMROLE] ' + newMember.user.username + '#' + newMember.user.discriminator +
              ': ' + removedRole);
          break;
      case Changes.username:
          console.log('[' + guild.name + '][UPDUSRNM] ' + oldMember.user.username + '#' + oldMember.user.discriminator +
              ' is now ' + newMember.user.username + '#' + newMember.user.discriminator);
          break;
      case Changes.nickname:
          console.log('[' + guild.name + '][UPDUSRNK] ' + newMember.user.username + '#' + newMember.user.discriminator +
              (oldMember.nickname != null ? ' (' + oldMember.nickname + ')' : '') +
              (newMember.nickname != null ? ' is now ' + newMember.nickname : ' no longer has a nickname.'));
          break;
      case Changes.avatar:
          console.log('[' + guild.name + '][UPDAVT] ' + newMember.user.username + '#' + newMember.user.discriminator);
          break;
  }


  //post in the guild's log channel
  var log = guild.channels.find('name', CHANNEL);
  if (log != null) {
      switch(change) {
          case Changes.unknown:
              log.sendMessage('누가 들어옴......' + newMember);
              break;
          case Changes.nickname:
              log.sendMessage('닉네임 변함......' + newMember + '>...' + '...< ' + oldMember.nickname + ' > 원래 닉' );
              break;
           case Changes.avatar:
              log.sendMessage('아바타 바뀜......' + newMember);
              break;
      }
  }

});

// Load commands

bot.commands = new discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");

  if (jsfiles.length <= 0) return console.log("There are no commands to load...");

  console.log(`Loading ${jsfiles.length} commands...`);
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

// Message event
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(bot, message, args);


});

bot.login(process.env.token);
function formatConsoleMessage(message) {
    return message.cleanContent.replace(new RegExp('\n', 'g'), '\n\t');
}
