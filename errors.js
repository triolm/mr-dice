module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

module.exports.InputError = class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
    }
}

module.exports.
    handleErr = async (e) => {
        if (e.message && (e instanceof module.exports.NotFoundError || e instanceof module.exports.InputError)) {
            let send = {
                title: `Error`,
                description: e.message,
                color: 0xff6666
            }
            // await message.channel.send({ embeds: [send] });
            return send;
        }
        else {
            console.log(e)
            let send = {
                title: `Error`,
                description: "An error occured.",
                color: 0xff6666
            }
            // await message.channel.send({ embeds: [send] });
            return send;
        }
    }
