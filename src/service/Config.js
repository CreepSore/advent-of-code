import fs from "fs";
import path from "path";

export default class ConfigModel {
    static #instance;
    /** @type {ConfigModel} */
    static get instance() {
        return this.#instance || (this.#instance = new ConfigModel(path.resolve(".")));
    }

    #configPath;
    
    /**
     * Creates an instance of ConfigModel.
     * @param {string} path
     * @memberof ConfigModel
     */
    constructor(path) {
        this.#configPath = path;
        this.aoc = {
            cookie: ""
        };
    }

    load() {
        try {
            let data = fs.readFileSync(this.getConfigPath(), "utf8");
            let parsed = JSON.parse(data);
            Object.assign(this, parsed);
            return true;
        }
        catch {
            return false;
        }
    }

    saveTemplate() {
        fs.writeFileSync(this.getTemplatePath(), JSON.stringify(this, null, 2));
    }

    getTemplatePath() {
        return path.join(this.#configPath, "config.template.json");
    }

    getConfigPath() {
        return path.join(this.#configPath, "config.json");
    }
}
