const { MessageEmbed } = require("discord.js")

module.exports.formatMsg = command => {
    let total = 0
    let send = new MessageEmbed()

    if (!command.separate) {
        total = roll(command)
        send.setTitle(`${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die}`)
            .setDescription(total + "")
            .setColor(0xD7C363)
    }
    else {
        i = rollSeparate(command)
        total = i.total;
        nums = i.nums
        send.setTitle(`${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die}`)
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

module.exports.getDesc = async (item, category) => {

    data = await getItem(item, category)

    let send = new MessageEmbed()
        .setTitle(data.name)
        .setDescription(("Level " + data.level ?? "") + " " + data.school.name.toLowerCase() + (data.ritual ? " (ritual)" : "") + "\n")
        .setColor(0xD7C363);
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
    if (data.higher_level) {
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
    if (data.properties) {
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
        val += " " + data.damage.damage_type.name.toLowerCase()
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
    .addFields({
        name: "!roll <number of dice>d<sides of dice> + <modifier>",
        value: "Example: !roll 6d8 + 12\nThis rolls 6 eight sided dice and adds 10. Modifier is optional"
    })
    .addFields({
        name: "!roll <number of dice>d<sides of dice> + <modifier> separate",
        value: "Example: !roll 6d8 + 12 separate\nThis rolls 6 eight sided dice and adds 10, and separately displays the rolls."
    })
    .addFields({
        name: "!cast <spell> + 10",
        value: "Example: !cast fireball + 10\nThis rolls 8d6, the damage for fireball and adds 10."
    })
    .addFields({
        name: "!cast <spell> lvl 4",
        value: "Example: !cast fireball lvl 4\nThis rolls 9d6, the damage for fireball when cast at level 4."
    })
    .addFields({
        name: "!weapon <weapon> + 10",
        value: "Example: !weapon shortsword\nThis rolls the default dice for a shortsword and adds 10."
    })
    .addFields({
        name: "!spelldesc <spell>",
        value: "Example: !spelldesc fireball\nThis retrieves the description of the spell fireball."
    })
    .addFields({
        name: "!item <item>",
        value: "Example: !item shortsword\nThis retrieves the description of a shortsword."
    })
    .addFields({
        name: "!magicitem <item>",
        value: "Example: !magicitem wand of fireballs\nThis retrieves the description of a wand of fireballs."
    })
