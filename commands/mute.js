const ms = require("ms");
const discord = require("discord.js");
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let logs = message.guild.channels.find('name', config.logsChannel);
  let reason = args.slice(2).join(' ');
  if(!tomute) return message.reply("ㅄ");
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "마스터권한"].includes(r.name)) )
      return message.reply("권한없음");
    if (!reason) return message.reply('이유없어요?');
    if (!logs) return message.reply(`로그 채널 ${config.logsChannel} 없어요?`);
  
  
  //if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole1 = message.guild.roles.find(`name`, "재갈");
  if(!muterole1){
    try{
      muterole1 = await message.guild.createRole({
        name: "재갈",
         color: "#000000",
         permissions:[]
       })
      message.guild.channels.forEach(async (channel, id) => {
         await channel.overwritePermissions(muterole1, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false
        });
      });
     }catch(e){
      console.log(e.stack);
     }
  }
  //start of create role
  /*
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "재갈",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  */
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("시간지정 안함?");

  await(tomute.addRole(muterole1.id));
  message.reply(`<@${tomute.id}> 이놈은 목아지가 ${reason} 때문에 ${ms(ms(mutetime))} 동안 비틀어 집니다. `);

  let embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(tomute.user.avatarURL)
        .addField('당한놈', `${tomute.user.username} with an ID: ${tomute.user.id}`)
        .addField('한놈', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('당시', message.createdAt)
        .addField('어디서', message.channel)
        .addField('뭐때문에', reason)
        .setFooter('당한새끼 정보', tomute.user.displayAvatarURL);
        
  logs.send(embed);

  setTimeout(function(){
    tomute.removeRole(muterole1.id);
    message.channel.send(`<@${tomute.id}> 풀어드렸읍니다.`);
  }, ms(mutetime));




//end of module
}

module.exports.help = {
  name: "mute"
}
