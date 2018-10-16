const discord = require("discord.js");
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(' ');
    let logs = message.guild.channels.find('name', config.logsChannel);

    if(!message.member.roles.some(r=>["Administrator", "Moderator", "마스터권한"].includes(r.name)) )
      return message.reply("권한없음");


    //if (!message.member.hasPermission('마스터권환')) return message.reply('권한 없음');
    

    if (!target) return message.reply('ㅄ');
    if (!reason) return message.reply('이유 없음');
    if (!logs) return message.reply(`로그폴더 ${config.logsChannel} 없음`);
    
    let embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('킥 당한놈', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('킥 한놈', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('킥 시간', message.createdAt)
        .addField('어디서', message.channel)
        .addField('이유', reason)
        .setFooter('킥당한놈 정보', target.user.displayAvatarURL);

    message.channel.send(`${target.user.username} 는  ${message.author} 에 의해 ${reason} 때문에 목이 잘렸습니다.`);
    target.kick(reason);
    logs.send(embed);
    

};

module.exports.help = {
    name: 'kick'
};
