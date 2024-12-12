import * as perfHooks from "perf_hooks";
import IAdventOfCodeChallenge from "@extensions/AdventOfCode.Core/logic/IAdventOfCodeChallenge";
import AdventOfCode2024 from "..";

export default class Day2 implements IAdventOfCodeChallenge<string> {
    id: string = "2024-02";
    repositoryId: string = AdventOfCode2024.repositoryId;
    dayId: number = 2;
    data: string;

    async initialize(data: string): Promise<void> {
        this.data = data;
    }

    async solve(): Promise<{[part: string]: string}> {
        const part1 = this.solvePart1(this.data);
        const part2 = this.solvePart2(this.data);

        return {
            1: part1,
            2: part2,
        };
    }

    public async performanceBenchmark(benchmarkCalls: number[], doWarmup: boolean = true): Promise<number[][]> {
        if(doWarmup) {
            for(let i = 0; i < 1000; i++) {
                this.solvePart1(this.data);
                this.solvePart2(this.data);
            }
        }

        const part1Results = [];
        for(const benchmarkCallCount of benchmarkCalls) {
            let total = 0;
            for(let i = 0; i < benchmarkCallCount; i++) {
                const startTime = perfHooks.performance.now();
                this.solvePart1(this.data);
                const endTime = perfHooks.performance.now();
                total += endTime - startTime;
            }
            total /= benchmarkCallCount;
            part1Results.push(total);
        }

        const part2Results = [];
        for(const benchmarkCallCount of benchmarkCalls) {
            let total = 0;
            for(let i = 0; i < benchmarkCallCount; i++) {
                const startTime = perfHooks.performance.now();
                this.solvePart1(this.data);
                const endTime = perfHooks.performance.now();
                total += endTime - startTime;
            }
            total /= benchmarkCallCount;
            part2Results.push(total);
        }

        return [part1Results, part2Results];
    }

    private solvePart1(data: string): string {
        let intResult: number = 0;

        const lines = data.split("\n");

        for(const line of lines) {
            if(!line) {
                continue;
            }

            const chars = line.split(" ");
            let direction = 0;

            for(let i = 1; i < chars.length; i++) {
                const prev = Number(chars[i - 1]);
                const curr = Number(chars[i]);

                let newDirection: number;
                if(prev === curr) {
                    newDirection = Number.MIN_VALUE;
                }
                else if(Math.abs(prev - curr) > 3) {
                    newDirection = Number.MIN_VALUE;
                }
                else if(curr > prev) {
                    newDirection = 1;
                }
                else if(curr < prev) {
                    newDirection = -1;
                }
                else {
                    newDirection = Number.MIN_VALUE;
                }

                if(newDirection !== direction && direction !== 0) {
                    direction = Number.MIN_VALUE;
                    break;
                }

                direction = newDirection;

                if(direction === Number.MIN_VALUE) {
                    break;
                }
            }

            if(direction !== Number.MIN_VALUE) {
                intResult++;
            }
        }

        return String(intResult);
    }

    private validityCheckPart2(prev: number, curr: number): number {
        let direction: number;

        if(prev === curr) {
            direction = Number.MIN_VALUE;
        }
        else if(Math.abs(prev - curr) > 3) {
            direction = Number.MIN_VALUE;
        }
        else if(curr > prev) {
            direction = 1;
        }
        else if(curr < prev) {
            direction = -1;
        }
        else {
            direction = Number.MIN_VALUE;
        }

        return direction;
    }

    private solvePart2(data: string): string {
        let intResult: number = 0;

        // TODO

        return String(intResult);
    }
}
