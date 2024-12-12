import {EventEmitter} from "events";

import IExecutionContext, { IAppExecutionContext, ICliExecutionContext } from "@service/extensions/IExecutionContext";
import IExtension, { ExtensionMetadata } from "@service/extensions/IExtension";
import ConfigLoader from "@logic/config/ConfigLoader";
import Core from "@extensions/Core";
import AdventOfCodeCore from "@extensions/AdventOfCode.Core";
import Day1 from "./day-1/Day1";
import Day2 from "./day-2/Day2";

class AdventOfCode2024Config {

}

export default class AdventOfCode2024 implements IExtension {
    static repositoryId = "2024";

    static metadata: ExtensionMetadata = {
        name: "AdventOfCode.2024",
        version: "1.0.0",
        description: "AOC 2024 Module",
        author: "ehdes",
        dependencies: [Core, AdventOfCodeCore],
    };

    metadata: ExtensionMetadata = AdventOfCode2024.metadata;

    config: AdventOfCode2024Config = new AdventOfCode2024Config();
    events: EventEmitter = new EventEmitter();
    $: <T extends IExtension>(name: string|Function & { prototype: T }) => T;

    constructor() {
        this.config = this.loadConfig();
    }

    async start(executionContext: IExecutionContext): Promise<void> {
        this.checkConfig();
        this.$ = <T extends IExtension>(name: string|Function & { prototype: T }) => executionContext.extensionService.getExtension(name) as T;
        if(executionContext.contextType === "cli") {
            await this.startCli(executionContext);
            return;
        }
        else if(executionContext.contextType === "app") {
            await this.startMain(executionContext);
            return;
        }
    }

    async stop(): Promise<void> {

    }

    private async startCli(executionContext: ICliExecutionContext): Promise<void> {

    }

    private async startMain(executionContext: IAppExecutionContext): Promise<void> {
        const aocCore = this.$(AdventOfCodeCore);
        aocCore.registerChallenge(new Day1());
        aocCore.registerChallenge(new Day2());
    }

    private checkConfig(): void {
        if(!this.config) {
            throw new Error(`Config could not be found at [${this.generateConfigNames()[0]}]`);
        }
    }

    private loadConfig(createDefault: boolean = false): typeof this.config {
        const [configPath, templatePath] = this.generateConfigNames();
        return ConfigLoader.initConfigWithModel(
            configPath,
            templatePath,
            new AdventOfCode2024Config(),
            createDefault,
        );
    }

    private generateConfigNames(): string[] {
        return [
            ConfigLoader.createConfigPath(`${this.metadata.name}.json`),
            ConfigLoader.createTemplateConfigPath(`${this.metadata.name}.json`),
        ];
    }
}
