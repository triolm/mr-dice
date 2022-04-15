const { Client, MessageEmbed, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const { parseRoll, parseSpell, parseItem } = require('./messageparsing.js');
const { formatMsg, getDesc, helpObj } = require('./messageformatting.js');
const { handleErr } = require('./errors.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

client.on('messageCreate', async (message) => {
    try {
        const { send, called } = await getCmd(message.content)

        if (called) {
            await message.channel.send({ embeds: [send] });
        }

    } catch (e) {
        handleErr(e, message);
    }
});

(async () => {
    await client.login(process.env.TOKEN)
        .then(() => {
            let d = new Date(Date.now()).toString();
            fs.appendFile("./log.txt", `${d}\nLogged in as ${client.user.tag}\nCurrently in ${client.guilds.cache.size} guilds\n\n`, () => { });
        }).catch((e) => {
            let d = new Date(Date.now()).toString();
            fs.appendFile("./log.txt", `${d}\n${e}\n\n`, () => { });
        })

    client.api.applications(client.user.id).guilds('771106320623206460').commands.post({
        data: new SlashCommandBuilder()
            .setName('roll')
            .setDescription('Roll some dice')
            .addStringOption(option =>
                option.setName('amount')
                    .setDescription('amount of dice')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('sides')
                    .setDescription('number of sides')
                    .setRequired(true))
    })
})()


getCmd = async (message) => {
    send = ""
    called = true;
    if (!message.startsWith('!')) return { send, called: false };

    if (message.startsWith("!roll")) {
        let command = parseRoll(message.trim().replace('!roll', ''));
        send = formatMsg(command);
    } else if (message.startsWith('!cast')) {
        let command = await parseSpell(message.trim().replace('!cast', ''));
        send = formatMsg(command);
    } else if (message.startsWith('!weapon')) {
        let command = await parseItem(message.trim().replace('!weapon', ''));
        send = formatMsg(command);
    } else if (message.startsWith("!item")) {
        let command = message.replace('!item', '').trim().replaceAll(" ", "-").toLowerCase();
        send = await getDesc(command, "equipment");
    } else if (message.toLowerCase().startsWith("!magicitem")) {
        let command = message.replace('!magicitem', '').trim().replaceAll(" ", "-").toLowerCase();
        send = await getDesc(command, "magic-items");
    } else if (message.toLowerCase().startsWith("!spelldesc")) {
        let command = message.replace('!spelldesc', '').trim().replaceAll(" ", "-").toLowerCase();
        send = await getDesc(command, "spells");
    } else if (message.toLowerCase().startsWith("!help")) {
        send = helpObj;
    } else {
        called = false;
    }

    return { send, called }
}