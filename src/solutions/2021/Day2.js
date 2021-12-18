import Stopwatch from "../../service/Stopwatch.js";

export default class Solution {
    parseInput(input) {
        return input
            .split('\n')
            .map(x => x.match(/^([a-zA-Z]+) (\d+)$/))
            .filter(x => x !== null)
            .map(x => {return {direction: x[1], distance: Number(x[2])};});
    }

    /**
     * @param {Array<{direction: string, distance: number}>} input 
     */
    async solvePart1(input) {
        let token = Stopwatch.instance.start();
        let horizontal = input.filter(x => x.direction === "forward").reduce((acc, cur) => acc + cur.distance, 0);
        let vertical = input.filter(x => ["up", "down"].includes(x.direction)).reduce((acc, cur) => acc + (cur.distance * (cur.direction === "up" ? -1 : 1)), 0);

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: horizontal * vertical
        };
    }

    /**
     * @param {Array<{direction: string, distance: number}>} input 
     */
    async solvePart2(input) {
        let token = Stopwatch.instance.start();
        let aim = 0;
        let depth = 0;
        let horizontal = 0;

        for(let instruction of input) {
            if(instruction.direction === "up") {
                aim -= instruction.distance;
            }

            if(instruction.direction === "down") {
                aim += instruction.distance;
            }

            if(instruction.direction === "forward") {
                horizontal += instruction.distance
                depth += aim * instruction.distance;
            }
        }

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: horizontal * depth
        };
    }

    async solve(input) {
        let parsedInput = this.parseInput(input);

        return [await this.solvePart1(parsedInput), await this.solvePart2(parsedInput)];
    }
};
