import Stopwatch from "../../service/Stopwatch.js";

export default class Solution {
    flipArray(input) {
        const result = [];
        input.forEach(line => {
            for(let i = 0; i < input[0].length; i++) {
                result[i] = result[i] ? `${result[i]}${line[i]}` : line[i];
            }
        });
        return result;
    }

    parseInputPart1(input) {
        return this.flipArray(input.split("\n"));
    }

    parseInputPart2(input) {
        return input.split("\n");
    }

    /**
     * @param {Array<string>} input 
     */
    async solvePart1(input) {
        const token = Stopwatch.instance.start();
        const gammaConstructor = [];
        const epsilonConstructor = [];

        input.forEach(bitLine => {
            let zeroNum = [...bitLine].filter(char => char === "0").length;
            let oneNum = [...bitLine].filter(char => char === "1").length;
            gammaConstructor.push(oneNum > zeroNum ? "1" : "0");
            epsilonConstructor.push(oneNum > zeroNum ? "0" : "1");
        });

        const gamma = parseInt(gammaConstructor.join(""), 2);
        const epsilon = parseInt(epsilonConstructor.join(""), 2);

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: gamma * epsilon
        };
    }

    /**
     * @param {Array<string>} input 
     */
    findOxygenRating(input) {

    }

    /**
     * @param {Array<string>} input 
     */
    findScrubberRating(input) {
    }

    /**
     * @param {Array<string>} input 
     */
    async solvePart2(input) {
        const token = Stopwatch.instance.start();
        const flipped = this.flipArray(input);
        const oxygenRating = this.findOxygenRating(input);
        const scrubberRating = this.findScrubberRating(input);

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: null
        };
    }

    async solve(input) {
        return [await this.solvePart1(this.parseInputPart1(input)), await this.solvePart2(this.parseInputPart2(input))];
    }
};
