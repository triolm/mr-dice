const { roll, rollSeparate, getItem } = require('./dicerolling.js');
const fs = require('fs');

const { MessageEmbed } = require("discord.js")

module.exports.formatMsg = command => {
    let total = 0
    let send = new MessageEmbed()

    if (command.ndice > 1000000 || command.die > 1000000) {
        throw new InputError("Numbers too large")
    }
    if (command.ndice > 100) {
        command.separate = false;
    }
    if (!command.separate) {
        if (typeof command.ndice == "number") {
            total = roll(command)
            send.setTitle(`${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die}`)
                .setDescription(total + "")
                .setColor(0xD7C363)
        }
        else {
            total = 0;
            string = "";
            for (let i = 0; i < command.ndice.length; i++) {
                total += roll({ ndice: command.ndice[i], die: command.die[i], mod: 0 })
                string += `${command.ndice[i]}d${command.die[i]}`
                string += i + 1 < command.ndice.length ? " + " : ""
            }
            total += command.mod
            send.setTitle(`${command.item ? command.item + ": " : ""} ${string}`)
                .setDescription(total + "")
                .setColor(0xD7C363)
        }
    }
    else {
        i = rollSeparate(command)
        total = i.total;
        nums = i.nums
        send.setTitle(`${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die} `)
            .setDescription(nums + "")
            .addFields({
                name: "Total:",
                value: total + ""
            })
            .setColor(0xD7C363)
        if (command.mod) send.description = send.description + "" + (command.mod < 0 ? " - " : " + ") + command.mod

    }

    if (command.mod) send.setTitle(send.title + (command.mod < 0 ? " - " : " + ") + command.mod)

    return send;
}

module.exports.getList = async (type) => {
    all = JSON.parse(await fs.readFileSync("./lists.txt", "utf8", () => 0))[type];
    embeds = [new MessageEmbed()
        .setTitle("All " + type)
        .setColor(0xD7C363)]
    for (i of all) {
        embeds.push(new MessageEmbed()
            .setDescription(i)
            // .setTitle("All Spells")
            .setColor(0xD7C363))
    }
    return embeds;

}

module.exports.getDesc = async (item, category) => {
    item = item
    data = await getItem(item.replaceAll(" ", "-"), category)

    let send = new MessageEmbed()
        .setTitle(data.name)
        .setDescription("")
    if (data.level) {
        send.setDescription(("Level " + data.level ?? "") + " " + data.school.name.toLowerCase() + (data.ritual ? " (ritual)" : "") + "\n")
    }
    send.setColor(0xD7C363);
    if (data.cost) {
        send.addFields({
            name: "Cost:",
            value: data.cost.quantity + data.cost.unit
        })
    }
    if (data.weight + 1) {
        send.addFields({
            name: "Weight:",
            value: data.weight + ""
        })
    }
    if (data.desc) {
        for (i of data.desc) {
            send.description += "\n" + i
        }
    }
    if (data.higher_level && data.higher_level.length) {
        higherlvl = ""
        for (i of data.higher_level) {
            higherlvl += i + "\n";
        }
        send.addFields({
            name: "At Higher Levels:",
            value: higherlvl
        })
    }
    if (data.components) {
        components = ""
        for (i of data.components) {
            components += i + " ";
        }
        send.addFields({
            name: "Components:",
            value: components
        })
    }
    if (data.classes) {
        classes = ""
        for (i of data.classes) {
            classes += i.index + ", ";
        }
        send.addFields({
            name: "Classes:",
            value: classes.slice(0, -2)
        })
    }
    if (data.material) {
        send.addFields({
            name: "Material:",
            value: data.material
        })
    }

    if (data.casting_time) {
        send.addFields({
            name: "Casting Time:",
            value: data.casting_time
        })
    }
    if (data.duration) {
        send.addFields({
            name: "Duration:",
            value: (data.concentration ? "Concentration\n" : "") + data.duration
        })
    }
    if (data.properties && data.properties.length) {
        properties = ""
        for (i of data.properties) {
            properties += ", " + i.name
        }
        send.addFields({
            name: "Properties",
            value: properties.replace(", ", "")
        })
    }
    if (data.damage) {
        val = ""
        if (data.damage.damage_at_slot_level) {
            val = data.damage.damage_at_slot_level[data.level]
        }
        else if (data.damage.damage_at_character_level) {
            val = data.damage.damage_at_character_level[Object.keys(data.damage.damage_at_character_level)[0]]
        }
        if (data.damage.damage_type) {
            val += " " + (data.damage.damage_type.name.toLowerCase())
        }
        if (val) {
            send.addFields({
                name: "Damage:",
                value: val
            });
        }
    }
    if (data.range) {
        send.addFields({
            name: "Range:",
            value: (data.category_range ? data.category_range : "") + " " + (data.range.normal ?? data.range)
        });
    }
    return send;
}
module.exports.helpObj = new MessageEmbed()
    .setTitle("Commands")
    .setColor(0xD7C363)
    .addFields({
        name: "! prefix commands (deprecated)",
        value: "__**These will be removed on August 31**__, but if you would still like to use them visit https://top.gg/bot/800748470931423272 for help."
    })
    .addFields({
        name: "/roll <number of dice> <sides of dice> <modifier> <separate>",
        value: "This this rolls the given amount of dice each with the given amout of sides. The <modifier> option is a number \
        added to the total and defaults to zero. The <separate> option displays the individual dice separately and defaults to false."
    })
    .addFields({
        name: "/cast <spell> <level> <modifier>",
        value: "This rolls the damage dice for the given D&D spell. The level option allows for upcasting and defaults to the spell's base level. The modifier is a number added to the total."
    })
    .addFields({
        name: "/weapon <weapon> <modifier>",
        value: "This rolls the damage dice for the given D&D weapon. The modifier is a number added to the total."
    })
    .addFields({
        name: "/spelldesc <spell>",
        value: "This retrieves the description of the given D&D spell."
    })
    .addFields({
        name: "/spellslist",
        value: "This retrieves a list of all the spells available to this bot. It will be sent to you as a DM."
    })
    .addFields({
        name: "/item <item>",
        value: "This retrieves the description of the given D&D weapon or item."
    })
    .addFields({
        name: "/itemslist",
        value: "This retrieves a list of all the items available to this bot. It will be sent to you as a DM."
    })
    .addFields({
        name: "/magicitem <item>",
        value: "This retrieves the description of the given D&D magic item."
    })
    .addFields({
        name: "/invite",
        value: "This provides the invite link for this bot."
    })
    .addFields({
        name: "Privacy Policy",
        value: "https://github.com/triolm/mr-dice/blob/master/privacy_policy.md"
    })
    .addFields({
        name: "Further Issues",
        value: "For further issues or questions, join our support server at https://discord.gg/haf48fW2YF."
    })
module.exports.inviteObj = new MessageEmbed()
    .setTitle("Invite Mr. Dice to a Server")
    .setColor(0xD7C363)
    .setDescription('https://discord.com/api/oauth2/authorize?client_id=800748470931423272&permissions=0&scope=bot%20applications.commands');

module.exports.listObj = new MessageEmbed()
    .setTitle("List was sent to you as a direct message!")
    .setColor(0xD7C363)

module.exports.deprecation = new MessageEmbed()
    .setTitle("Text Commands are Deprecated")
    .setDescription("Please use slash commands instead (ex. /roll). Text commands (using the ! prefix) \
    will be removed on August 31, 2022. \nIf slash commands do not work, please reinvite this bot with \
    [this link](https://discord.com/api/oauth2/authorize?client_id=800748470931423272&permissions=0&scope=bot%20applications.commands).\
    if you continue to experience issues, join the support server [here](https://discord.gg/haf48fW2YF).")
    .setColor(0xff6666)

