const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let unmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!unmute) return message.reply("ㅄ");
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "마스터권한"].includes(r.name)) )
      return message.reply("권한없음");
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
  let muterole2 = message.guild.roles.find(`name`, "수갑");
  if(!muterole2){
    try{
      muterole2 = await message.guild.createRole({
        name: "수갑",
         color: "#000000",
         permissions:[]
       })
      message.guild.channels.forEach(async (channel, id) => {
         await channel.overwritePermissions(muterole2, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false
        });
      });
     }catch(e){
      console.log(e.stack);
     }
  }

  unmute.removeRole(muterole1.id);
  unmute.removeRole(muterole2.id);
  message.reply(`<@${unmute.id}> 풀어드렸습니다. `);
}
module.exports.help = {
  name: "unmute"
}
