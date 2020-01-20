const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async(client, message, args) => {

  let mutetime = "0s";
  let mutetime2 = "5s";
  //!tempmute @user 1s/m/h/d
  let tomute = message.guild.member(message.mentions.users.first());

  if(!tomute){
    message.reply(`End of Debate.`)
    return;
  }

  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");

  let muterole = message.guild.roles.find(`name`, "muted");
  //start of debater1 mute
  if(!muterole){
    try{
      muterole = message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }

  if(!mutetime) return message.reply("You didn't specify a time!");

  //end of debater1 mute
  let tomute2 = message.guild.member(message.mentions.users.last());

  if(!tomute2) return;

  if(tomute2.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");

  let muterole2 = message.guild.roles.find(`name`, "muted");
  //start of debater2 mute
  if(!muterole2){
    try{
      muterole2 = message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole2, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of debater2 mute
  if(!mutetime2) return message.reply("You didn't specify a time!");

  const interval = setInterval( () => {

    setTimeout(function(){
    tomute.addRole(muterole.id);
    message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime2))}`);
    }, ms(mutetime2));

    setTimeout(function(){
      tomute2.removeRole(muterole2.id);
      message.channel.send(`<@${tomute2.id}> has been unmuted!`);
    }, ms(mutetime2));

    setTimeout(function(){
      tomute2.addRole(muterole2.id);
      message.reply(`<@${tomute2.id}> has been muted for ${ms(ms(mutetime2))}`);
    }, ms(mutetime2)*2);

    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> has been unmuted!`);
    }, ms(mutetime2)*2);
  }, 10000);

  const collector = message.channel.createMessageCollector(() => true);
  collector.on("collect", m => {
    if(m.content === "stop") {
      clearInterval(interval);
      collector.stop();
    }
  })
}


module.exports.help = {
  name: "debate"
}
