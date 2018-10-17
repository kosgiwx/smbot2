const discord = require("discord.js");
const config = require('../config.json');
if(!message.guild.author.hasPermission("ADMINISTRATOR"))
{
    return message.channel.send(`권한 팔아먹음?`);
}
module.exports.run = async (bot, message, args) => {
    message.channel.send(`!ban 밴할놈 사유`);
    message.channel.send(`!kick 킥할놈 사유`);
    message.channel.send(`!hand 채팅 불가 시킬놈 시간 사유`);
    message.channel.send(`!mute 채팅,보이스 불가 시킬놈 시간 사유`);
    message.channel.send(`!unmute 채팅,보이스 불가 "사면" 시킬놈`);

};

module.exports.help = {
    name: 'help'
};
