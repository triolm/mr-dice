module.exports.formatMsg = command => {
    let total = roll(command)
    let send = {
        title: `${command.item ? command.item + ": " : ""} ${command.ndice}d${command.die}`,
        description: total,
        color: 0xD7C363
    }
    if (command.mod) send.title += (command.mod < 0 ? " - " : " + ") + command.mod

    return send;
}

module.exports.getDesc = async (item, category) => {

    data = await getItem(item, category)

    let send = {
        title: data.name,
        description: "",
        fields: [
        ],
        color: 0xD7C363
    }
    if (data.cost) {
        send.fields.push({
            name: "Cost:",
            value: data.cost.quantity + data.cost.unit
        })
    }
    if (data.weight) {
        send.fields.push({
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