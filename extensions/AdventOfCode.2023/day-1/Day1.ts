import * as perfHooks from "perf_hooks";
import IAdventOfCodeChallenge from "@extensions/AdventOfCode.Core/logic/IAdventOfCodeChallenge";
import AdventOfCode2023 from "..";
import LogBuilder from "@service/logger/LogBuilder";

export default class Day1 implements IAdventOfCodeChallenge<string> {
    id: string = "2023-01";
    repositoryId: string = AdventOfCode2023.repositoryId;
    dayId: number = 1;
    data: string;

    async initialize(data: string): Promise<void> {
        this.data = data;
    }

    async solve(): Promise<{[part: string]: string}> {
        const part1 = this.solvePart1(this.data);
        const part2 = this.solvePart2(this.data);

        return {
            "1": part1,
            "2": part2,
        };
    }

    public async performanceBenchmark(benchmarkCalls: number[], doWarmup: boolean = true): Promise<number[][]> {
        let testResults: number[] = [];

        if(doWarmup) {
            for(let i = 0; i < 1000; i++) {
                this.solvePart1(this.data);
                this.solvePart2(this.data);
            }
        }

        let part1Results = [];
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

        let part2Results = [];
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

        let firstNumber: number = null;
        let lastNumber: number = null;

        [...data].forEach(currentChar => {
            const currentCharNumber: number = Number(currentChar);

            if(currentChar === "\n") {
                intResult += (firstNumber * 10) + lastNumber;
                firstNumber = null;
                lastNumber = null;
            }
            else if(!isNaN(currentCharNumber)) {
                if(firstNumber === null) {
                    firstNumber = currentCharNumber;
                }

                lastNumber = currentCharNumber;
            }
        });

        return String(intResult);
    }

    private solvePart2(data: string): string {
        const mapping = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const front = /^.*?([1-9]|one|two|three|four|five|six|seven|eight|nine)/;
        const back = /^.*([1-9]|one|two|three|four|five|six|seven|eight|nine).*$/;

        return String(
            data
                .split("\n")
                .filter(Boolean)
                .map(line => [line.match(front)[1], line.match(back)[1], line])
                .map(values => {
                    let front = Number(values[0]);
                    let back = Number(values[1]);

                    if(isNaN(front)) {
                        front = mapping.indexOf(values[0]);
                    }

                    if(isNaN(back)) {
                        back = mapping.indexOf(values[1]);
                    }

                    return [front, back];
                })
                .reduce((prev, current) => prev + (current[0] * 10 + current[1]), 0)
        );
    }
}
