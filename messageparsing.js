const { InputError, NotFoundError } = require('./errors')
const { getItem } = require('./dicerolling.js');


module.exports.parseRoll = msg => {
    let command = {}
    if (msg.includes("separate")) {
        msg.replace("separate", "")
        command.separate = true;
    }

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]
    dice = getDice(msg)
    command.ndice = dice.ndice
    command.die = dice.die
    if (!command.ndice || !command.die) {
        throw new InputError("Type !help for help")
    }
    if (command.ndice > 1000000 || command.die > 1000000) {
        throw new InputError("Numbers too large")
    }
    if (command.ndice > 100) {
        command.separate = false;
    }
    return command;
}

module.exports.parseSpell = async msg => {
    let command = {}
    let level = 0

    if (msg.includes('lvl')) {
        level = parseInt(msg.split('lvl')[1].trim())
        msg = msg.split('lvl')[0].trim()
    }

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]

    command.item = msg.trim().toLowerCase().replace(" ", "-")
    spell = await getItem(command.item, "spells");
    if (!level || !(level in (spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level))) {
        level = (spell.level ? spell.level : Object.keys(spell.damage.damage_at_character_level)[0]);
    }
    command.item = "Level " + level + " " + command.item;
    try {
        spellDice = getDice((spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level)[level]);
    } catch (e) {
        throw new InputError("Spell does not do damage");
    }
    command.ndice = spellDice.ndice;
    command.die = spellDice.die;

    return command;
}

module.exports.slashSpell = async (spell, lvl, mod) => {
    let command = {}
    let level = lvl

    command.mod = mod

    command.item = spell
    spell = await getItem(command.item.replaceAll(" ", "-"), "spells");
    if (!level || !(level in (spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level))) {
        level = (spell.level ? spell.level : Object.keys(spell.damage.damage_at_character_level)[0]);
    }
    command.item = "Level " + level + " " + command.item;
    try {
        spellDice = getDice((spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level)[level]);
    } catch (e) {
        throw new InputError("Spell does not do damage");
    }
    command.ndice = spellDice.ndice;
    command.die = spellDice.die;

    return command;
}

module.exports.parseItem = async msg => {
    let command = {}

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]

    command.item = msg.trim().toLowerCase().replaceAll(" ", "-")
    item = await getItem(command.item);
    try {
        itemDice = getDice(item.damage.damage_dice);
    }
    catch (e) {
        throw new InputError("Item does not do damage")
    }
    command.ndice = itemDice.ndice
    command.die = itemDice.die

    return command;
}

module.exports.slashItem = async (item, mod) => {
    let command = {}

    command.mod = mod

    command.item = item
    item = await getItem(command.item.replaceAll(" ", "-"));
    try {
        itemDice = getDice(item.damage.damage_dice);
    }
    catch (e) {
        throw new InputError("Item does not do damage")
    }
    command.ndice = itemDice.ndice
    command.die = itemDice.die

    return command;
}

getDice = msg => {
    dice = {}
    if (msg.includes('d')) {
        dice.ndice = parseInt(msg.split('d')[0]);
        dice.die = parseInt(msg.split('d')[1]);
        if (!dice.ndice) {
            dice.ndice = 1;
        }
    }
    return dice

}

getMod = msg => {
    if (msg.includes('+')) {
        mod = parseInt(msg.split('+')[1]);
    }
    else if (msg.includes('-')) {
        mod = -1 * msg.split('-')[1];
    }
    else {
        mod = 0;
    }
    return mod
}
