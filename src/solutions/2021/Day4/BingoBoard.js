
export default class BingoBoard {
    #lines;
    get lines() {
        return this.#lines;
    }

    #calledNumbers = [];

    /**
     * @param {number[][]} lines 
     */
    constructor(lines) {
        this.#lines = lines;
    }

    callNumbers(numbers) {
        numbers.forEach(num => this.callNumber(num));
    }

    callNumber(number) {
        this.#calledNumbers.push(number);
    }

    isCalled(number) {
        return this.#calledNumbers.includes(number);
    }

    getSum() {
        return this.#lines
            .flat()
            .filter(num => !this.#calledNumbers.includes(num))
            .reduce((a, b) => a + b);
    }

    hasWon() {
        const wonHorizontally = this.#lines.map(line => line.map(x => this.isCalled(x))).some(line => !line.some(x => x === false));
        const wonVertically = BingoBoard.transposeArray(this.#lines).map(line => line.map(x => this.isCalled(x))).some(line => !line.some(x => x === false))

        return wonHorizontally || wonVertically;
    }

    /**
     * @param {string} string
     */
    static fromString(string) {
        const lines = string
            .split("\n")
            .filter(Boolean)
            .map(line => line.split(" ")
                             .filter(Boolean)
                             .map(Number));
        return new BingoBoard(lines);
    }

    static transposeArray(array) {
        return array[0].map((x, i) => array.map(y => y[i]));
    }
}

