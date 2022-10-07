const axios = require('axios')
const { InputError, NotFoundError } = require('./errors')

module.exports.roll = command => {

    total = 0
    for (let i = 0; i < command.ndice; i++) {
        total += Math.ceil(Math.random() * command.die);
    }
    total += command.mod;
    return total;
}

module.exports.rollSeparate = (command) => {
    roll = {}
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

module.exports.getItem = async (item, category = "equipment") => {
    try {
        res = await axios.get(`https://www.dnd5eapi.co/api/${category}/${item}`)
        return res.data;
    }
    catch (e) {
        throw new NotFoundError(`${category == "spells" ? "Spell" : "Item"} ${item} not found`)
    }
}