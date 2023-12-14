import * as perfHooks from "perf_hooks";
import IAdventOfCodeChallenge from "@extensions/AdventOfCode.Core/logic/IAdventOfCodeChallenge";
import AdventOfCode2023 from "..";

export default class Day3 implements IAdventOfCodeChallenge<string> {
    id: string = "2023-03";
    repositoryId: string = AdventOfCode2023.repositoryId;
    dayId: number = 3;
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

        for(let i = 0; i < 1000; i++) {
            this.solvePart2(this.data);
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
        return "";
    }

    private solvePart2(data: string): string {
        return "";
    }
}
