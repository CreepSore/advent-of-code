import {EventEmitter} from "events";

import IExecutionContext, { IAppExecutionContext, ICliExecutionContext } from "@service/extensions/IExecutionContext";
import IExtension, { ExtensionMetadata } from "@service/extensions/IExtension";
import ConfigLoader from "@logic/config/ConfigLoader";
import Core from "@extensions/Core";
import IAdventOfCodeRepository, { AdventOfCodeRepositoryOptions } from "./logic/IAdventOfCodeRepository";
import AdventOfCodeRepository from "./logic/AdventOfCodeRepository";
import IAdventOfCodeChallenge from "./logic/IAdventOfCodeChallenge";
import LogBuilder from "@service/logger/LogBuilder";

class AdventOfCodeCoreConfig {
    runBenchmarks: boolean = false;
    repositories: {[key: string]: AdventOfCodeRepositoryOptions} = {
        2023: {
            id: "2023",
            baseUrl: "https://adventofcode.com/2023",
            cookie: "",
            dataCacheLocation: "./aoc-cache/2023/",
            skipCache: false,
        },
    };
}

export default class AdventOfCodeCore implements IExtension {
    static metadata: ExtensionMetadata = {
        name: "AdventOfCode.Core",
        version: "1.0.0",
        description: "Template Module",
        author: "ehdes",
        dependencies: [Core],
    };

    metadata: ExtensionMetadata = AdventOfCodeCore.metadata;

    config: AdventOfCodeCoreConfig = new AdventOfCodeCoreConfig();
    events: EventEmitter = new EventEmitter();

    repositories: Map<string, IAdventOfCodeRepository> = new Map();
    challenges: Set<IAdventOfCodeChallenge<any>> = new Set();

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

    registerChallenge(challenge: IAdventOfCodeChallenge<any>): void {
        this.challenges.add(challenge);
    }

    private async startCli(executionContext: ICliExecutionContext): Promise<void> {

    }

    private async startMain(executionContext: IAppExecutionContext): Promise<void> {
        this.initializeRepositories();

        executionContext.application.onAfterStartup(async() => {
            await this.executeChallenges();

            if(this.config.runBenchmarks) {
                await this.executePerformanceBenchmarks();
            }
        });
    }

    private async executePerformanceBenchmarks(): Promise<void> {
        const benchmarkCalls = [1, 10, 100, 1000, 10000];
        for(const challenge of this.challenges.values()) {
            LogBuilder
                .start()
                .level("INFO")
                .info("AdventOfCode.Core", "Benchmark", challenge.id)
                .line("Executing Benchmarks ...")
                .done();

            const results = await challenge.performanceBenchmark(benchmarkCalls, true);

            for(let i = 0; i < results.length; i++) {
                for(let j = 0; j < benchmarkCalls.length; j++) {
                    LogBuilder
                        .start()
                        .level("INFO")
                        .info("AdventOfCode.Core", "Benchmark", challenge.id, String(i + 1), String(benchmarkCalls[j]))
                        .line(`${results[i][j]}ms AVG`)
                        .done();
                }
            }
        }
    }

    private async executeChallenges(): Promise<void> {
        for(const challenge of this.challenges.values()) {
            const challengeRepository = this.repositories.get(challenge.repositoryId);
            if(!challengeRepository) {
                LogBuilder
                    .start()
                    .level("ERROR")
                    .info("AdventOfCode.Core")
                    .line(`Failed to find repository <${challenge.repositoryId}> of challenge <${challenge.id}>`)
                    .done();

                continue;
            }

            const challengeData = await challengeRepository.getDayData(challenge.dayId);
            if(!challengeData) {
                LogBuilder
                    .start()
                    .level("ERROR")
                    .info("AdventOfCode.Core")
                    .line(`Failed to get Data from <${challenge.repositoryId}> of challenge <${challenge.id}>`)
                    .done();

                continue;
            }

            LogBuilder
                .start()
                .level("INFO")
                .info("AdventOfCode.Core")
                .line(`Solving Challenge <${challenge.id}>`)
                .done();

            await challenge.initialize(challengeData);
            const solutions = await challenge.solve();

            Object.entries(solutions)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .forEach(([partId, solution]) => {
                    LogBuilder
                        .start()
                        .level("INFO")
                        .info("AdventOfCode.Core", challenge.id, partId)
                        .line(solution)
                        .done();
                });
        }
    }

    private initializeRepositories(): void {
        const repositoryOptions = this.config.repositories;
        for(const [name, options] of Object.entries(repositoryOptions)) {
            const repository = new AdventOfCodeRepository();
            repository.setup(options);
            this.repositories.set(name, repository);
        }
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
            new AdventOfCodeCoreConfig(),
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
