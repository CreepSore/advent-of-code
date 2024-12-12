import * as perfHooks from "perf_hooks";
import IAdventOfCodeChallenge from "@extensions/AdventOfCode.Core/logic/IAdventOfCodeChallenge";
import AdventOfCode2024 from "..";

export default class Day2 implements IAdventOfCodeChallenge<string> {
    id: string = "2024-01";
    repositoryId: string = AdventOfCode2024.repositoryId;
    dayId: number = 1;
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
            for(let i = 0; i < 10000; i++) {
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

        const arr0: number[] = [];
        const arr1: number[] = [];

        let currentNum = "";
        for(let i = 0; i < data.length; i++) {
            const char = data[i];

            if(char === " ") {
                if(currentNum) {
                    arr0.push(Number(currentNum));
                    currentNum = "";
                }
            }
            else if(char === "\n") {
                arr1.push(Number(currentNum));
                currentNum = "";
            }
            else {
                currentNum += char;
            }
        }

        arr0.sort();
        arr1.sort();

        for(let i = 0; i < arr0.length; i++) {
            intResult += Math.abs(arr0[i] - arr1[i]);
        }

        return String(intResult);
    }

    private solvePart2(data: string): string {
        let intResult: number = 0;

        const arr0: number[] = [];
        const count: Record<number, number> = {};

        let currentNum = "";
        for(let i = 0; i < data.length; i++) {
            const char = data[i];

            if(char === " ") {
                if(currentNum) {
                    arr0.push(Number(currentNum));
                    currentNum = "";
                }
            }
            else if(char === "\n") {
                count[Number(currentNum)] ??= 0;
                count[Number(currentNum)] += 1;
                currentNum = "";
            }
            else {
                currentNum += char;
            }
        }

        for(let i = 0; i < arr0.length; i++) {
            intResult += (count[arr0[i]] || 0) * arr0[i];
        }

        return String(intResult);
    }
}
