module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

module.exports.InputError = class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}