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
        if (command.mod) send.fields[0].value = send.fields[0].value + (command.mod < 0 ? " - " : " + ") + command.mod

    }

    if (command.mod) send.setTitle(send.title + (command.mod < 0 ? " - " : " + ") + command.mod)

    return send;
}

module.exports.getDesc = async (item, category) => {

    data = await getItem(item, category)

    let send = new MessageEmbed()
        .setTitle(data.name)
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
        send.description = ""
        for (i in data.desc) {
            send.description += "\n" + i
        }
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
        send.addFields({
            name: "Damage:",
            value: data.damage.damage_dice + " " + data.damage.damage_type.name.toLowerCase()
        });
    }
    if (data.range) {
        send.addFields({
            name: "Range:",
            value: data.category_range + " " + data.range.normal
        });
    }
    console.log(send)
    return send;
}