const discord = require("discord.js");
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(' ');
    let logs = message.guild.channels.find('name', config.logsChannel);

    if(!message.member.roles.some(r=>["Administrator", "Moderator", "마스터권한"].includes(r.name)) )
      return message.reply("권한없음");

    if (!target) return message.reply('뉘신지');
    if (!reason) return message.reply('이유없어요?');
    if (!logs) return message.reply(`로그 채널 ${config.logsChannel} 없어요?`);
    
    let embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('당한놈', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('한놈', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('당시', message.createdAt)
        .addField('어디서', message.channel)
        .addField('뭐때문에', reason)
        .setFooter('당한새끼 정보', target.user.displayAvatarURL);

    message.channel.send(`${target.user.username} was banned by ${message.author} for ${reason}`);
    target.ban(reason);
    logs.send(embed);


};

module.exports.help = {
    name: 'ban'
};
