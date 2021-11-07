const { InputError } = require('./errors')

module.exports.parseRoll = msg => {
    let command = {}

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]
    dice = getDice(msg)
    command.ndice = dice.ndice
    command.die = dice.die
    if (!command.ndice || !command.die) {
        throw new InputError("Type !help for help")
    }
    return command;
}

module.exports.parseSpell = async msg => {
    let command = {}

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]

    command.spell = msg.trim().toLowerCase().replace(" ", "-")
    spell = await getItem(command.spell, "spells");
    try {
        spellDice = getDice(spell.damage.damage_at_slot_level ? spell.damage.damage_at_slot_level[spell.level] : spell.damage.damage_at_character_level[Object.keys(spell.damage.damage_at_character_level)[0]]);
    } catch (e) {
        throw new InputError("Spell does not do damage")
    }
    command.ndice = spellDice.ndice
    command.die = spellDice.die

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
