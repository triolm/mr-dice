const { Client, MessageEmbed, Intents } = require('discord.js');
const axios = require('axios')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { parseRoll, parseSpell, parseItem } = require('./messageparsing.js');
const { NotFoundError, InputError } = require('./errors')
require('dotenv').config();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
    try {
        if (message.content.startsWith("!roll")) {

            let command = parseRoll(message.content.trim().replace('!roll', ''));
            let total = roll(command)
            let send = {
                title: `${command.ndice}d${command.die}`,
                description: total,
                color: 0xD7C363
            }
            if (command.mod) send.title += (command.mod < 0 ? " - " : " + ") + command.mod

            await message.channel.send({ embed: send });
        }
        else if (message.content.startsWith('!cast')) {
            let command = await parseSpell(message.content.trim().replace('!cast', ''));
            let total = roll(command)
            let send = {
                title: `${command.spell}: ${command.ndice}d${command.die}`,
                description: total,
                color: 0xD7C363
            }
            if (command.mod) send.title += (command.mod < 0 ? " - " : " + ") + command.mod

            await message.channel.send({ embed: send });
        }

        else if (message.content.startsWith('!weapon')) {
            let command = await parseItem(message.content.trim().replace('!weapon', ''));

            let total = roll(command)
            let send = {
                title: `${command.item}: ${command.ndice}d${command.die}`,
                description: total,
                color: 0xD7C363
            }
            if (command.mod) send.title += (command.mod < 0 ? " - " : " + ") + command.mod

            await message.channel.send({ embed: send });
        }
    } catch (e) {
        if (e instanceof NotFoundError || e instanceof InputError) {
            let send = {
                title: `Error`,
                description: e.message,
                color: 0xff6666
            }
            await message.channel.send({ embed: send });
        }
        else { console.log(e) }
    }
})


roll = command => {
    total = 0
    for (i = 0; i < command.ndice; i++) {
        total += Math.ceil(Math.random() * command.die);
    }
    total += command.mod;
    return total;
}

getSpell = async spell => {
    try {
        res = await axios.get(`https://www.dnd5eapi.co/api/spells/${spell}`)
        return res.data;
    }
    catch {
        throw new NotFoundError("Spell not found")
    }
}
getItem = async item => {
    try {
        res = await axios.get(`https://www.dnd5eapi.co/api/equipment/${item}`)
        return res.data;
    }
    catch {
        throw new NotFoundError("Item not found")
    }
}



client.login(process.env.TOKEN);
console.log(process.env.TOKEN);