const { MessageEmbed } = require("discord.js")

module.exports.formatMsg = command => {
    let total = roll(command)
    let send = new MessageEmbed()
        .setTitle(`${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die}`)
        .setDescription(total + "")
        .setColor(0xD7C363)
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
    if (data.weight) {
        send.addFields({
            name: "Weight:",
            value: data.weight
        })
    }
    if (data.desc) {
        for (i = 0; i < data.desc.length; i++) {
            send.description += "\n" + data.desc[i]
        }
    }
    return send;
}