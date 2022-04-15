NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

InputError = class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
    }
}

module.exports.
    handleErr = async (e, message) => {
        if (e instanceof NotFoundError || e instanceof InputError) {
            let send = {
                title: `Error`,
                description: e.message,
                color: 0xff6666
            }
            await message.channel.send({ embeds: [send] });
        }
        else {
            console.log(e)
        }
    }
