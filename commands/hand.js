const discord = require("discord.js");
const ms = require("ms");
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let handman = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let reason = args.slice(2).join(' ');
  let logs = message.guild.channels.find('name', config.logsChannel);
  if(!handman) return message.reply("ㅄ");
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "마스터권한"].includes(r.name)) )
      return message.reply("권한없음");
  if (!reason) return message.reply('이유없어요?');
  if (!logs) return message.reply(`로그 채널 ${config.logsChannel} 없어요?`);
  
  //if(handman.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  
  let handrole = message.guild.roles.find(`name`, "수갑");
  
  if(!handrole){
    try{
      handrole = await message.guild.createRole({
        name: "수갑",
         color: "#000000",
         permissions:[]
       })
      message.guild.channels.forEach(async (channel, id) => {
         await channel.overwritePermissions(handrole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
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
  let handtime = args[1];
  if(!handtime) return message.reply("시간지정 안함?");

  await(handman.addRole(handrole.id));
  message.reply(`<@${handman.id}> 이놈은 "손"목아지만 ${ms(ms(handtime))} 동안 비틀어 집니다. `);

  let embed = new discord.RichEmbed()
  .setColor('RANDOM')
  .setThumbnail(handman.user.avatarURL)
  .addField('손목아지 당한놈', `${handman.user.username} 아이디 : ${handman.user.id}`)
  .addField('시전한 관리자', `${message.author.username} 아이디 : ${message.author.id}`)
  .addField('언제', message.createdAt)
  .addField('어디서', message.channel)
  .addField('뭐때문에', reason)
  .setFooter('당한새끼 정보', handman.user.displayAvatarURL);
  
logs.send(embed);


  setTimeout(function(){
    handman.removeRole(handrole.id);
    message.channel.send(`<@${handman.id}> 풀어드렸읍니다.`);
  }, ms(handtime));


  

//end of module
}

module.exports.help = {
  name: "hand"
}
