const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, roleId } = require('./config/config.json');
let members = [];
let showName, showPlan, showTime, lostName= '';

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
        
    }else if (command === 'plan'){
        if (!members.length){
            return message.channel.send('あなたは誰ですか？まずあなたのことを教えて下さい');
        }

        if (`${args}` === ''){
            return message.channel.send('あなたの予定を教えて下さい');
        }

        for (let i = 0; i < members.length; i++){
            if( members[i].id === message.author.id ){
                members[i].name = message.author.username;
                members[i].plan = args;
                members[i].update_time = message.createdAt;
                return message.channel.send(`${message.author.username}さん、あなたの予定を把握しました`);
            }
        }

        return message.channel.send('あなたは誰ですか？まずあなたのことを教えて下さい');

    }else if (command === 'plandel'){
        for (let i = 0; i < members.length; i++){
            if( members[i].id === message.author.id ){
                members[i].name = message.author.username;
                members[i].plan = '';
                members[i].update_time = message.createdAt;
                return message.channel.send('あなたの予定を削除しました');
            }
        }

        return message.channel.send('あなたは誰ですか？まずあなたのことを教えて下さい');

    }else if (command === 'list'){
        if (!members.length){
            return message.channel.send('まだ誰の予定も把握できていません');
        }else if (`${args}` !== ''){
            for (let i = 0; i < members.length; i++){
                if(members[i].name  === `${args}`|| members[i].id === `${args}`){
                    searchName = members[i].name;
                    showPlan = members[i].plan;
                    showTime = members[i].update_time;
                    message.channel.send(`${searchName}の予定はこちらになります`);
                    message.channel.send(`schedule: ${showPlan}\n update_time: ${showTime}`);
                    return message.channel.send('--------------------------------------------------------------');
                }
            }

            return message.channel.send('お探しの人はいません、誰かと間違えているのでは？');
        }else {
            message.channel.send('私が把握している予定はこちらになります');
            for (let i = 0; i < members.length; i++){
                showName = members[i].name;
                showPlan = members[i].plan;
                showTime = members[i].update_time;

                message.channel.send(`${showName}\n schedule: ${showPlan}\n update_time: ${showTime}`);
                message.channel.send('--------------------------------------------------------------');
            }
            return message.channel.send('皆さんの予定を把握できましたか？');
        }
    }else if (command === 'del'){ 
        if (roleId !== `${message.member._roles}`){
            return message.channel.send('あなたにその権限はありません');
        }else if (!args.length){
            return message.channel.send('削除する人を指定してください');
        }

        for (let i = 0; i < members.length; i++){
            if(members[i].name  === `${args}`|| members[i].id === `${args}`){
                lostName = members[i].name;
                members.splice(i, 1);
                return message.channel.send(`${lostName}さんの記録を削除しました......`);
            }
        }
        
        return message.channel.send('その人はいません、誰かと間違えているのでは？');
    }
});

client.login(token);