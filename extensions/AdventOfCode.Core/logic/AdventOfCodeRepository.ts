import LogBuilder from "@service/logger/LogBuilder";
import IAdventOfCodeRepository, { AdventOfCodeRepositoryOptions } from "./IAdventOfCodeRepository";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";

export default class AdventOfCodeRepository implements IAdventOfCodeRepository {
    private options: AdventOfCodeRepositoryOptions;

    constructor() {

    }

    async setup(options: AdventOfCodeRepositoryOptions): Promise<void> {
        this.options = options;
    }

    async getDayData(dayId: number): Promise<string> {
        let result: string;
        if(!this.options.skipCache) {
            result = await this.getCachedDayData(dayId);
        }

        if(!result) {
            result = await this.fetchDayData(dayId);

            if(!this.options.skipCache) {
                await this.saveData(dayId, result);
            }
        }

        return result;
    }

    private async getCachedDayData(dayId: number): Promise<string> {
        const cacheDirExists = fs.existsSync(this.options.dataCacheLocation);
        if(!cacheDirExists) {
            await fsp.mkdir(this.options.dataCacheLocation, {recursive: true});
            return;
        }

        const filePath = this.getDayCachePath(dayId);

        if(!fs.existsSync(filePath)) {
            return;
        }

        return await fsp.readFile(filePath, "utf-8");
    }

    private async fetchDayData(dayId: number): Promise<string> {
        const dataResult = fetch(`${this.options.baseUrl}/day/${dayId}/input`, {
            headers: {
                Cookie: this.options.cookie,
            },
        }).then(res => res.text());

        return dataResult;
    }

    private async saveData(dayId: number, data: string): Promise<void> {
        LogBuilder
            .start()
            .level("INFO")
            .info("AdentOfCodeRepository", this.options.id)
            .line(`Cached input of ${dayId}.`)
            .done();

        const cacheDirExists = fs.existsSync(this.options.dataCacheLocation);
        if(!cacheDirExists) {
            await fsp.mkdir(this.options.dataCacheLocation, {recursive: true});
            return;
        }

        await fsp.writeFile(this.getDayCachePath(dayId), data, "utf-8");
    }

    private getDayCachePath(dayId: number): string {
        return path.resolve(this.options.dataCacheLocation, String(dayId) + ".txt");
    }
}
