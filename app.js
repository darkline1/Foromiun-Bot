// Load up the discord.js library
const Discord = require("discord.js");

const TOKEN = "Mzc5MjQ5NTI2Nzk3NzYyNTYw.DOnTOA.9u7VHasvKHzBrMwy5lHlqmWdrtg";
const PREFIX = "f:";

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers | foromiun.rf.gd`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers | foromiun.rf.gd`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers | foromiun.rf.gd`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  // Blacklist
  if(message.author.id == "0") { return};
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  if(command === "help") {
       message.channel.sendMessage("```The prefix is: f:\nUser commands: ping, help, staff, updates, invite, site, blacklist\nStaff commands: kick, ban, purge [DISABLED], say```")
  }
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "staff"){
    message.channel.sendMessage("``` Bot Owner & Host: darkline1\n Web Master & Owner: grifkuba.net\n Owner: darkline1\n Co Owner: WavyTaeTae\n Administrator: xXAmazingTuku, 2blocky2\n Moderator: Renewable123``` Not listed? Contact darkline1#9081 to be added!")
  }
  
  if(command === "updates"){
    message.channel.sendMessage ("``11/19/17``**:**\nFixed the listing of staff. Added new lines so that it's not unorganized anymore.\nStaff list itself updated.\nA few other commands were also updated.\nAdded a blacklist; if you spam our bot then you'll end up there, probably permanently.")
  }
  
    if(command === "site"){
    message.channel.sendMessage ("http://foromiun.grifkuba.net")
	message.delete().catch(O_o=>{});
  }
  
    if(command === "website"){
    message.channel.sendMessage ("http://foromiun.grifkuba.net")
	message.delete().catch(O_o=>{});
  }
  
  if(command === "invite"){
    message.channel.sendMessage("```You need the Manage Servers permission in your server in order to add me!```\nAdd me to your server with this link: https://discordapp.com/oauth2/authorize?client_id=379249526797762560&scope=bot&permissions=10")
  }
  
  if(command === "blacklist"){
    message.channel.sendMessage("**This is the Foromiun Bot blacklist. Users will be listed by name, id, reason, and who blacklisted them.**\nFor example: darkline1#9081, 190725487964717056, spam, darkline1. **This is an example.**\n\nBlacklist:\nNobody yet. ;)")
  }
  
  if(command === "say") {
    if(!message.member.roles.some(r=>["OWNER", "CO OWNER", "ADMINISTRATOR", "SUPERVISOR", "Bot Commander"].includes(r.name)) )
    return message.reply("This command is restricted from your role. Maybe your permission level is too low?");
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["administration commands", "Bot Commander"].includes(r.name)) )
      return message.reply("This command is restricted from your role. Maybe your permission level is too low?");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["ADMINISTRATOR", "OWNER", "CO OWNER", "SUPERVISOR", "Bot Commander"].includes(r.name)) )
      return message.reply("This command is restricted from your role. Maybe your permission level is too low?");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge-2trfewgsaaeggewg") {
    // This command removes all messages from all users in the channel, up to 100. Original command: purge
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
      return message.reply("Please provide a number between 2 and 1000 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(TOKEN);
           
