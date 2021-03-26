const Discord = require('discord.js');
const client = new Discord.Client();
const token = "some token";
let intervalIds = new Map();

client.on('ready', () => {
  client.user.setStatus('!pingme');
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let tokens = msg.content.split(' ');
  if(tokens[0]=="!stop" || tokens[0]=="!abort") {
    let id = intervalIds.get(msg.author);
    if(id==undefined) {
      msg.reply("I am litteraly not even pinging you what do you want me to do");
      return;
    }
    clearInterval(id);
    msg.reply("Stopped.");
    intervalIds.set(msg.author, undefined);
    return;
  }
  if (tokens[0] === '!pingme') {
    if(tokens.length<3) {
      msg.reply("This command requires the following arguments: !pingme <interval> <dm|here>");
      return;
    }
    let stringTime = timeString(tokens[1]);
    if(stringTime!=null) {
      if(parseInt(tokens[1].match(/\d/g).join(''))<2) {
        if(parseInt(tokens[1].match(/\d/g).join(''))==0) {
          msg.reply("That would really break it..");
          return;
        }
        msg.reply("Note: The pings may not be every second because of the chat cooldown.");
      }
      if(tokens[2]=="here")
        msg.reply("Pinging you here every "+stringTime);
      else 
        msg.reply("Pinging you in dms every "+stringTime);
      let time = timeMilliseconds(tokens[1]);
      if(time!=null) {
        if(ping(msg.author)==null) {
          msg.reply("Why did you block me :(((");
        }
        intervalIds.set(msg.author, setInterval(ping, time, msg.author, tokens[2], msg.channel));
      }
    } else {
      msg.reply("Invalid time unit. Use 1s, 1m, 1h, 1d");
    }
  }
});

function ping(sender, channelSelected, channel) {
  if(channelSelected!="here") {
    sender.send(`${sender.toString()}`).catch(err => {
      clearInterval(intervalIds.get(sender));
      return null;
    });
  } else {
    channel.send(`${sender.toString()}`).catch(err => {
      clearInterval(intervalIds.get(sender));
      return null;
    });
  }
  return 0;
}

function timeMilliseconds(string) {
  const digits = string.match(/\d/g);
  if(string.match(/s/g)[0]) {
    return parseInt(digits.join(''))*1000;
  } else if(string.match(/m/g)[0]) {
    return parseInt(digits.join(''))*60000;
  } else if(string.match(/h/g)[0]) {
    return parseInt(digits.join(''))*60000*60;
  } else if(string.match(/d/g)[0]) {
    return parseInt(digits.join(''))*60000*60*24;
  }
  return null;
}

function timeString(string) {
  const regx = /\D/g;
  const match = string.match(regx);
  const digits = string.match(/\d/g);
  if(match==null || match.length>1) {
    return null;
  }
  if(match[0]=="s") {
    if(digits.join('')=="1") 
      return 'second';
    else
      return digits.join('')+" seconds";
  } else if(match[0]=="m") {
    if(digits.join('')=="1") 
      return 'minute';
    else
      return digits.join('')+" minutes";
  } else if(match[0]=="h") {
    if(digits.join('')=="1") 
      return 'hour';
    else
      return digits.join('')+" hours";
  } else if(match[0]=="d") {
    if(digits.join('')=="1") 
      return 'day';
    else
      return digits.join('')+" days";
  } 
}

client.login(token);