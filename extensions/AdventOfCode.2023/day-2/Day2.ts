import * as perfHooks from "perf_hooks";
import IAdventOfCodeChallenge from "@extensions/AdventOfCode.Core/logic/IAdventOfCodeChallenge";
import AdventOfCode2023 from "..";

const maxCubeAmounts = [
    0,  // NONE
    12, // R
    13, // G
    14, // B
];

const CubeGameColor: {[key: string]: number} = {
    NONE: 0,
    r: 1,
    g: 2,
    b: 3,
};

interface CubeGameSetEntry {
    count: number;
    color: number;
}

type CubeGameSet = CubeGameSetEntry[];

class CubeGame {
    id: number;
    sets: CubeGameSet[] = [];

    valid: boolean = true;
    neededCubes: number[] = [-1, -1, -1, -1];

    constructor(id: number) {
        this.id = id;
    }

    addSet(...sets: CubeGameSet[]): void {
        sets.flat().every(set => {
            if(set.count > maxCubeAmounts[set.color]) {
                this.valid = false;
                return false;
            }

            return true;
        });

        sets.flat().forEach(set => {
            const isMore = set.count > this.neededCubes[set.color];
            if(isMore) {
                this.neededCubes[set.color] = set.count;
            }
        });

        this.sets.push(...sets);
    }

    clear(): void {
        this.sets = [];
    }

    static fromLine(line: string): CubeGame {
        const [, gameId, setString] = line.match(/^Game (\d+): (.+)$/);
        const sets: CubeGameSet[] = (
            setString
                .split(";")
                .map(set =>
                    set.match(/(?:\d+) (?:r|g|b)/g).map(setEntry => ({
                        count: Number(setEntry.substring(0, setEntry.length - 2)),
                        color: CubeGameColor[setEntry.substring(setEntry.length - 1)],
                    })),
                )
        );

        const cubeGame = new CubeGame(Number(gameId));
        cubeGame.addSet(...sets);
        return cubeGame;
    }
}

export default class Day2 implements IAdventOfCodeChallenge<string> {
    id: string = "2023-02";
    repositoryId: string = AdventOfCode2023.repositoryId;
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
        const lines = data.split("\n");

        const total = lines
            .filter(Boolean)
            .map(CubeGame.fromLine)
            .filter(game => game.valid)
            .reduce((prev, curr) => prev + curr.id, 0);

        return String(total);
    }

    private solvePart2(data: string): string {
        const lines = data.split("\n");

        const total = lines
            .filter(Boolean)
            .map(CubeGame.fromLine)
            .map(game =>
                game.neededCubes[CubeGameColor.r]
                * game.neededCubes[CubeGameColor.g]
                * game.neededCubes[CubeGameColor.b],
            )
            .reduce((prev, curr) => prev + curr, 0);

        return String(total);
    }
}
