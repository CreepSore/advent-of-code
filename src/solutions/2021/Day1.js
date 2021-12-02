import Stopwatch from "../../service/Stopwatch.js";

export default class Solution {
    parseInput(input) {
        return input
            .split('\n')
            .map(x => Number(x))
            .filter(x => !isNaN(x));
    }

    /**
     * @param {Array<number>} input 
     */
    async solvePart1(input) {
        let token = Stopwatch.instance.start();
        let incrementations = 0;

        for(let i = 1; i < input.length; i++) {
            let last = input[i - 1];
            let current = input[i];

            current > last && incrementations++;
        }

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: incrementations
        };
    }

    /**
     * @param {Array<number>} input 
     */
    async solvePart2(input) {
        let token = Stopwatch.instance.start();
        let incrementations = 0;

        for(let i = 1; i < input.length; i++) {
            let last = input[i - 1] + input[i] + input[i + 1]    // input.slice(i - 1, i + 2).reduce((a, b) => a + b);
            let current = input[i] + input[i + 1] + input[i + 2] // input.slice(i, i + 3).reduce((a, b) => a + b);

            current > last && incrementations++;
        }

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: incrementations
        };
    }

    async solve(input) {
        let parsedInput = this.parseInput(input);

        return [await this.solvePart1(parsedInput), await this.solvePart2(parsedInput)];
    }
};
