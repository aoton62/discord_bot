const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config/config.json');
let members = [];
let a, b, c = '';
//let key = Object.keys(members);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'newmember'){
        if ( !members.length ){
            members.push({id: message.author.id, name: message.author.username, plan: undefined, update_time: message.createdAt});
            return message.channel.send(`はじめまして${message.author.username}さん`);
        }

        for (let i = 0; i < members.length; i++){
            if( members[i].id === message.author.id ){
                return message.channel.send(`${message.author.username}さん、あなたのことは知っていますよ`);
            }
        }

        members.push({id: message.author.id, name: message.author.username, plan: undefined, update_time: message.createdAt});
        return message.channel.send(`はじめまして${message.author.username}さん`);
        
    }else if( command === 'plan') {
        if (!members.length){
            return message.channel.send('あなたは誰ですか？まずあなたのことを教えて下さい');
        }
        for (let i = 0; i < members.length; i++){
            if( members[i].id === message.author.id ){
                members[i].name = message.author.username;
                members[i].plan = args;
                return message.channel.send(`${message.author.username}さん、あなたの予定を把握しました`);
            }
        }

        return message.channel.send('あなたは誰ですか？まずあなたのことを教えて下さい');

    }else if (command === 'list'){
        if (!members.length){
            return message.channel.send('まだ誰の予定も把握できていません');
        }else {
            message.channel.send('私が把握している予定はこちらになります');
            for (let i = 0; i < members.length; i++){
                a = members[i].name;
                b = members[i].plan;
                c = members[i].update_time
                message.channel.send('-----------------------------------');
                message.channel.send(`${a}\n schedule: ${b}\n update_time: ${c}`);
                //message.channel.send(`${members[i].name}\n schedule: ${members[i].plan}\n update_time: ${members[i].update_time}`);
                message.channel.send('-----------------------------------');
            }
            return message.channel.send('皆さんの予定を把握できましたか？');
        }
    }
});

client.login(token);