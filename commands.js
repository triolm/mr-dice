const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = [
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
        .setName('cast')
        .setDescription('Roll dice for D&D spell')
        .addStringOption(option =>
            option.setName('spell')
                .setDescription('Spell to cast')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('modifier')
                .setDescription('number to add to total')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('level to upcast spell')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('weapon')
        .setDescription('Roll dice for D&D weapon')
        .addStringOption(option =>
            option.setName('weapon')
                .setDescription('Weapon to roll for')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('modifier')
                .setDescription('number to add to total')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('magicitem')
        .setDescription('Get D&D magic item info')
        .addStringOption(option =>
            option.setName('magicitem')
                .setDescription('Magic item to get description of')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('item')
        .setDescription('Get D&D item info')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Item to get description of')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Description of Mr. Dice commands'),
    new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Get Mr. Dice's invite link."),
    new SlashCommandBuilder()
        .setName('spellslist')
        .setDescription("Get a list of all of Mr. Dice's spells in a DM."),
    new SlashCommandBuilder()
        .setName('itemslist')
        .setDescription("Get a list of all of Mr. Dice's items in a DM."),
]