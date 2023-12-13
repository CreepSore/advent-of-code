export default interface IAdventOfCodeChallenge<T> {
    id: string;
    repositoryId: string;
    dayId: number;

    initialize(data: string): Promise<void>;
    solve(): Promise<{[part: string]: T}>;
    performanceBenchmark(benchmarkCalls: number[], doWarmup: boolean): Promise<number[][]>;
}
