import * as uuid from "uuid";

export default class Stopwatch {
    static #instance;
    /** @returns {Stopwatch} */
    static get instance() {
        return this.#instance || (this.#instance = new Stopwatch());
    }

    constructor() {
        /** @type {Map<string, Number>} */
        this.running = new Map();
    }

    start() {
        let token = uuid.v4();
        this.running.set(token, Stopwatch.getCurrentTime());
        return token;
    }

    stop(token) {
        let end = Stopwatch.getCurrentTime();
        let start = this.running.get(token);
        if (start) {
            this.running.delete(token);
            return {
                token,
                start,
                end,
                duration: end - start
            };
        }
    }

    static getCurrentTime() {
        let hrtime = process.hrtime();
        return hrtime[0] * 1000 + hrtime[1] * 0.000001;
    }
}
