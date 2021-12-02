import fs from "fs";
import fetch from "node-fetch";
import path from "path";

import Config from "./Config.js";

export default class AdventOfCodeService {
    static async executeDays(year, dayFrom, dayTo) {
        let result = new Map();

        for(let i = dayFrom; i <= dayTo; i++) {
            if(!this.solutionExists(i, year)) continue;

            const data = await AdventOfCodeService.fetchDayData(i, year);
            const dayResult = await AdventOfCodeService.executeDay(i, year, data);
            result.set(i, dayResult);
        }

        return result.entries();
    }

    static async executeDay(day, year, data) {
        const SolutionClass = await import(this.getSolutionPath(day, year));
        const solution = new (SolutionClass.default)();

        return await solution.solve(data);
    }

    static async fetchDayData(day, year) {
        const sessionCookie = Config.instance.aoc.cookie;
        if(!this.dataExists(day, year)) {
            let data = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
                method: "GET",
                headers: {
                    Cookie: `session=${sessionCookie}`
                }
            }).then(res => res.text());

            fs.writeFileSync(this.getDataPath(day, year), data, "utf8");
            return data;
        }
        else {
            return fs.readFileSync(this.getDataPath(day, year), "utf8");
        }
    }

    static deleteDataRange(year, dayFrom, dayTo) {
        for(let i = dayFrom; i <= dayTo; i++) {
            this.deleteData(i, year);
        }
    }

    static deleteData(day, year) {
        if(this.dataExists(day, year)) {
            fs.unlinkSync(this.getDataPath(day, year));
        }
    }

    static solutionExists(day, year) {
        return fs.existsSync(this.getSolutionPath(day, year));
    }

    static dataExists(day, year) {
        return fs.existsSync(this.getDataPath(day, year));
    }

    static getSolutionPath(day, year) {
        return path.resolve(`./src/solutions/${year}/Day${day}.js`);
    }

    static getDataPath(day, year) {
        return path.resolve(`./src/solutions/${year}/Day${day}.txt`);
    }
};
