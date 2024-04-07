const { InputError, NotFoundError } = require('./errors')
const { getItem } = require('./dicerolling.js');


module.exports.slashSpell = async (spell, lvl, mod) => {
    let command = {}
    let level = lvl;

    command.item = spell;
    command.mod = mod;

    spell = await getItem(command.item.replaceAll(" ", "-"), "spells");
    try {
        if (!level || !(level in (spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level))) {
            level = (spell.level ? spell.level : Object.keys(spell.damage.damage_at_character_level)[0]);
        }
        command.item = "Level " + level + " " + command.item;
        spellDice = getDice((spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level)[level]);
        spellMod = getRawMod((spell.damage.damage_at_slot_level ?? spell.damage.damage_at_character_level)[level]);
        if (spellMod.includes("d")) {
            modDice = spellMod.split("d")
            spellDice.ndice = [spellDice.ndice, parseInt(modDice[0])]
            spellDice.die = [spellDice.die, parseInt(modDice[1])]
        } else {
            command.mod += parseInt(spellMod);
        }
    } catch (e) {
        throw new InputError("Spell does not do damage. Do you mean to use /spelldesc?");
    }
    command.ndice = spellDice.ndice;
    command.die = spellDice.die;
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
        throw new InputError("Item does not do damage. Do you mean to use /item?")
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

getRawMod = msg => {
    if (msg.includes('+')) {
        mod = msg.split('+')[1];
    }
    else if (msg.includes('-')) {
        mod = "-" + msg.split('-')[1];
    }
    else {
        mod = "0";
    }
    return mod
}
