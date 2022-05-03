const { Client, MessageEmbed, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const { parseRoll, parseSpell, parseItem } = require('./messageparsing.js');
const { roll } = require('./dicerolling.js');
const { formatMsg, getDesc, helpObj } = require('./messageformatting.js');
const { handleErr } = require('./errors.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


require('dotenv').config();

client.on('messageCreate', async (message) => {
    try {
        const { send, called } = await getCmd(message.content)

        if (called) {
            await message.channel.send({ embeds: [send] });
        }

    } catch (e) {
        await message.channel.send({ embeds: [await handleErr(e)] });
    }
});

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isCommand()) return;

        if (interaction.commandName == 'spelldesc') {
            await interaction.reply({ embeds: [await getDesc(interaction.options.get("spell").value, "spells")] });
        }
        if (interaction.commandName == 'itemdesc') {
            await interaction.reply({ embeds: [await getDesc(interaction.options.get("item").value, "equipment")] });
        }
        if (interaction.commandName == 'roll') {
            await interaction.reply({
                embeds: [formatMsg(
                    {
                        ndice: interaction.options.get("amount").value,
                        die: interaction.options.get("sides").value,
                        mod: interaction.options.get("modifier") ? interaction.options.get("modifier").value : 0,
                        separate: interaction.options.get("separate") ? interaction.options.get("separate").value : false,
                    }

                )]
            });
        }

    } catch (e) {
        await interaction.reply({ embeds: [await handleErr(e)] });
    }
});

(async () => {
    await client.login(process.env.TOKEN)
        .then(() => {
            let d = new Date(Date.now()).toString();
            console.log(`${d}\nLogged in as ${client.user.tag}\nCurrently in ${client.guilds.cache.size} guilds`)
            fs.appendFile("./log.txt", `${d}\nLogged in as ${client.user.tag}\nCurrently in ${client.guilds.cache.size} guilds\n\n`, () => { });
        }).catch((e) => {
            let d = new Date(Date.now()).toString();
            fs.appendFile("./log.txt", `${d}\n${e}\n\n`, () => { });
        })
})()

commands = [
    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll some dice')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('amount of dice')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('number of sides')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('modifier')
                .setDescription('number to add to total')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('separate')
                .setDescription('show individual dice roles')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('spelldesc')
        .setDescription('Get D&D spell info')
        .addStringOption(option =>
            option.setName('spell')
                .setDescription('Spell to get description of')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('itemdesc')
        .setDescription('Get D&D item info')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Item to get description of')
                .setRequired(true))
]

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands('905977803567145040', '771106320623206460'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();



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