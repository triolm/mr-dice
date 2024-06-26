const { Client, MessageEmbed, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const { slashSpell, slashItem } = require('./messageparsing.js');
const { formatMsg, getDesc, helpObj, inviteObj, listObj, getList } = require('./messageformatting.js');
const commands = require("./commands.js");
const { handleErr } = require('./errors.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isCommand()) return;

        if (interaction.commandName == 'help') {
            await interaction.reply({ embeds: [helpObj] });
        }
        if (interaction.commandName == 'invite') {
            await interaction.reply({ embeds: [inviteObj] });
        }
        if (interaction.commandName == 'spelldesc') {
            await interaction.reply({ embeds: [await getDesc(interaction.options.get("spell").value, "spells")] });
        }
        if (interaction.commandName == 'item') {
            await interaction.reply({ embeds: [await getDesc(interaction.options.get("item").value, "equipment")] });
        }
        if (interaction.commandName == 'magicitem') {
            await interaction.reply({ embeds: [await getDesc(interaction.options.get("magicitem").value, "magic-items")] });
        }
        if (interaction.commandName == 'cast') {
            lvl = interaction.options.get("level") ? interaction.options.get("level").value : 0;
            mod = interaction.options.get("modifier") ? interaction.options.get("modifier").value : 0;
            await interaction.reply({ embeds: [formatMsg(await slashSpell(interaction.options.get("spell").value, lvl, mod))] });
        }
        if (interaction.commandName == 'weapon') {
            mod = interaction.options.get("modifier") ? interaction.options.get("modifier").value : 0;
            await interaction.reply({ embeds: [formatMsg(await slashItem(interaction.options.get("weapon").value, mod))] });
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
        if (interaction.commandName == 'spellslist') {
            spells = await getList("spells");
            if (interaction.guild) {
                client.users.fetch(interaction.member.user.id)
                    .then(user => user.send({ embeds: spells }).catch(console.error))
                    .catch(console.error);
                await interaction.reply({ embeds: [listObj] });
            } else {
                await interaction.reply({ embeds: spells });

            }

        }
        if (interaction.commandName == 'itemslist') {
            spells = await getList("items");
            if (interaction.guild) {
                client.users.fetch(interaction.member.user.id)
                    .then(user => user.send({ embeds: spells }).catch(console.error))
                    .catch(console.error);
                await interaction.reply({ embeds: [listObj] });
            } else {
                await interaction.reply({ embeds: spells });

            }

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

// client.on("ready", () => {
//     client.user.setActivity('If slash commands do not work please reinvite with !invite', { type: "PLAYING" })
// })

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENTID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
