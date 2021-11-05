module.exports.parseRoll = msg => {
    let command = {}

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]
    dice = getDice(msg)
    command.ndice = dice.ndice
    command.die = dice.die

    return command;
}

module.exports.parseSpell = async msg => {
    let command = {}

    command.mod = getMod(msg);
    msg = msg.split('+')[0]
    msg = msg.split('-')[0]

    command.spell = msg.trim().toLowerCase().replace(" ", "-")
    spell = await getSpell(command.spell);
    try {
        spellDice = getDice(spell.damage.damage_at_slot_level ? spell.damage.damage_at_slot_level[spell.level] : spell.damage.damage_at_character_level[Object.keys(spell.damage.damage_at_character_level)[0]]);
    } catch (e) {
        throw new NotFoundError("Spell does not do damage")
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

    command.item = msg.trim().toLowerCase().replace(" ", "-")
    item = await getItem(command.item);
    itemDice = getDice(item.damage.damage_dice);
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


class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}