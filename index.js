const { Client, MessageEmbed, Intents } = require('discord.js');
const axios = require('axios')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { parseRoll, parseSpell, parseItem } = require('./messageparsing.js');
const { formatMsg, getDesc, helpObj } = require('./messageformatting.js');
const { NotFoundError, InputError } = require('./errors.js')
require('dotenv').config();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    try {
        let send = "";
        let called = true;
        if (!message.content.startsWith('!')) return;

        if (message.content.startsWith("!roll")) {
            let command = parseRoll(message.content.trim().replace('!roll', ''));
            send = formatMsg(command);
        } else if (message.content.startsWith('!cast')) {
            let command = await parseSpell(message.content.trim().replace('!cast', ''));
            send = formatMsg(command);
        } else if (message.content.startsWith('!weapon')) {
            let command = await parseItem(message.content.trim().replace('!weapon', ''));
            send = formatMsg(command);
        } else if (message.content.startsWith("!item")) {
            let command = message.content.replace('!item', '').trim().replaceAll(" ", "-").toLowerCase();
            send = await getDesc(command, "equipment");
        } else if (message.content.toLowerCase().startsWith("!magicitem")) {
            let command = message.content.replace('!magicitem', '').trim().replaceAll(" ", "-").toLowerCase();
            send = await getDesc(command, "magic-items");
        } else if (message.content.toLowerCase().startsWith("!spelldesc")) {
            let command = message.content.replace('!spelldesc', '').trim().replaceAll(" ", "-").toLowerCase();
            send = await getDesc(command, "spells");
        } else if (message.content.toLowerCase().startsWith("!help")) {
            send = helpObj;
        } else {
            called = false;
        }

        if (called) {
            await message.channel.send({ embeds: [send] });
        }

    } catch (e) {
        if (e instanceof NotFoundError || e instanceof InputError) {
            let send = {
                title: `Error`,
                description: e.message,
                color: 0xff6666
            }
            await message.channel.send({ embeds: [send] });
        }
        else {
            console.log(e)
        }
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

rollSeparate = (command) => {
    roll.nums = []
    roll.total = 0
    for (i = 0; i < command.ndice; i++) {
        n = Math.ceil(Math.random() * command.die);
        roll.nums.push(n);
        roll.total += n;
    }
    roll.total += command.mod;
    return roll
}

getItem = async (item, category = "equipment") => {
    try {
        res = await axios.get(`https://www.dnd5eapi.co/api/${category}/${item}`)
        return res.data;
    }
    catch {
        throw new NotFoundError("Item not found")
    }
}


client.login(process.env.TOKEN);