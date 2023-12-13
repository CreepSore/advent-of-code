export interface AdventOfCodeRepositoryOptions {
    id: string;
    baseUrl: string;
    cookie: string;
    dataCacheLocation: string;
    skipCache?: boolean;
}

export default interface IAdventOfCodeRepository {
    setup(options: AdventOfCodeRepositoryOptions): Promise<void>;
    getDayData(dayId: number): Promise<string>;
}
