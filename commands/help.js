const discord = require("discord.js");
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
if(message.author.hasPermission('MANAGE_CHANNELS'))
      {
      return message.reply("당신의 권한 대체되었다. yourmom");
      }
   
   if(message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) ) {
module.exports.run = async (bot, message, args) => {
    message.channel.send(`!ban 밴할놈 사유`);
    message.channel.send(`!kick 킥할놈 사유`);
    message.channel.send(`!hand 채팅 불가 시킬놈 시간 사유`);
    message.channel.send(`!mute 채팅,보이스 불가 시킬놈 시간 사유`);
    message.channel.send(`!unmute 채팅,보이스 불가 "사면" 시킬놈`);

            };
   }
}


module.exports.help = {
    name: 'help'
};
// message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name))
